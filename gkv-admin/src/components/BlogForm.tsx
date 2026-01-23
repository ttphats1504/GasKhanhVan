// pages/admin/BlogForm.tsx
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Upload, message, Switch } from "antd";
import { UploadOutlined, RedoOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";
import handleAPI from "../apis/handleAPI";
import Blog from "../models/Blog";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";

// 👇 đăng ký plugin cho Quill
Quill.register("modules/imageResize", ImageResize);

interface BlogFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (blog: Blog) => void;
  blog?: Blog | null;
  mode?: "add" | "edit" | "duplicate";
}

// Toolbar config
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
    handlers: {
      image: function (this: any) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files?.[0];
          if (file) {
            // 👉 convert file sang base64, chèn trực tiếp vào editor
            const reader = new FileReader();
            reader.onload = (e) => {
              const base64 = e.target?.result;
              const range = (this as any).quill.getSelection();
              if (range) {
                (this as any).quill.insertEmbed(range.index, "image", base64);
              } else {
                (this as any).quill.insertEmbed(0, "image", base64);
              }
            };
            reader.readAsDataURL(file);
          }
        };
      },
    },
  },
  // 👇 enable resize
  imageResize: {
    modules: ["Resize", "DisplaySize", "Toolbar"],
    parchment: Quill.import("parchment"),
    handleStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white",
    },
  },
};

const BlogForm: React.FC<BlogFormProps> = ({
  visible,
  onClose,
  onSuccess,
  blog,
  mode = "add",
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile | null>(null);
  const [content, setContent] = useState<string>("");

  const isEditing = mode === "edit";
  const isDuplicating = mode === "duplicate";
  useEffect(() => {
    if (blog && (isEditing || isDuplicating)) {
      // 👇 khi duplicate thì bỏ id
      const values = { ...blog };
      if (isDuplicating) {
        delete (values as any).id;
        values.title = values.title + " (copy)";
        values.slug = values.slug + "-copy";
      }
      form.setFieldsValue(values);
      setContent(blog.content || "");
    } else {
      form.resetFields();
      setContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blog, mode]);

  const handleFileChange = ({ file }: any) => {
    setFile(file);
  };

  const handleSubmit = async (values: any) => {
    let updatedContent = content;

    // Parse content HTML để tìm ảnh base64
    const div = document.createElement("div");
    div.innerHTML = content;
    const images = div.querySelectorAll("img");

    for (let img of Array.from(images)) {
      if (img.src.startsWith("data:image")) {
        const formDataImg = new FormData();
        formDataImg.append("file", dataURLtoBlob(img.src));

        try {
          const res: any = await handleAPI(
            "/api/uploads",
            "post",
            formDataImg,
            {
              "Content-Type": "multipart/form-data",
            },
          );
          // replace src base64 bằng url cloud
          updatedContent = updatedContent.replace(img.src, res.url);
        } catch (err) {
          console.error("Upload inline image failed:", err);
        }
      }
    }

    // Chuẩn bị formData blog
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("slug", values.slug);
    formData.append("author", values.author || "");
    formData.append("content", updatedContent);
    formData.append("published", values.published ? "true" : "false");

    if (file) {
      formData.append("thumbnail", file as any);
    }

    try {
      const response: any = isEditing
        ? await handleAPI(`/api/blogs/${blog?.id}`, "put", formData, {
            "Content-Type": "multipart/form-data",
          })
        : await handleAPI("/api/blogs", "post", formData, {
            "Content-Type": "multipart/form-data",
          });

      if (response) {
        message.success(
          `Blog ${isEditing ? "updated" : "added"} successfully!`,
        );
        onSuccess(response);
        onClose();
        form.resetFields();
        setFile(null);
        setContent("");
      }
    } catch (error) {
      message.error(`Error ${isEditing ? "updating" : "adding"} blog`);
    }
  };

  // Helper: convert base64 → Blob
  function dataURLtoBlob(dataUrl: string) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  return (
    <Modal
      title={isEditing ? "Edit Blog" : "Add Blog"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the blog title!" }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: "Please enter slug!" }]}
        >
          <Input placeholder="auto-generate if empty" />
        </Form.Item>

        <Form.Item label="Author" name="author">
          <Input placeholder="Enter author name" />
        </Form.Item>

        <Form.Item label="Upload Thumbnail" name="thumbnail">
          <Upload.Dragger
            name="thumbnail"
            beforeUpload={(file) => {
              handleFileChange({ file });
              return false;
            }}
            maxCount={1}
            onRemove={() => setFile(null)}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p>Click or drag file to upload</p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Content" name="content">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ minHeight: 200 }}
          />
        </Form.Item>

        <Form.Item label="Published" name="published" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          {isEditing ? (
            <Button type="primary" htmlType="submit">
              Update Blog
            </Button>
          ) : (
            <>
              <Button type="primary" htmlType="submit">
                Add Blog
              </Button>
              <Button
                type="dashed"
                icon={<RedoOutlined />}
                onClick={() => {
                  form.resetFields();
                  setContent("");
                  setFile(null);
                }}
                style={{ marginLeft: 8 }}
              >
                Clear
              </Button>
            </>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BlogForm;
