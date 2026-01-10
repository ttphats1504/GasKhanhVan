import React, { useState, useEffect } from "react";
import {
  Form,
  InputNumber,
  Button,
  Modal,
  Upload,
  message,
  Flex,
  Select,
} from "antd";
import { RedoOutlined, UploadOutlined } from "@ant-design/icons";
import Cropper from "react-easy-crop";
import type { UploadFile } from "antd/es/upload/interface";
import type { Area } from "react-easy-crop";
import handleAPI from "../apis/handleAPI";
import Banner from "../models/Banner";
import Category from "../models/Category";

interface BannerFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newBanner: Banner) => void;
  banner?: Banner | null;
}

const BannerForm: React.FC<BannerFormProps> = ({
  visible,
  onClose,
  onSuccess,
  banner,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile | File | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const isEditing = !!banner;

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res: any = await handleAPI("/api/categories", "get");
        setCategories(res || []);
      } catch (error) {
        message.error("Error loading categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (banner) {
      form.setFieldsValue(banner);
    } else {
      form.resetFields();
    }
  }, [banner, form]);

  const handleFileChange = ({ file }: { file: UploadFile | File }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(reader.result as string);
      setCropModalVisible(true);
    };
    reader.readAsDataURL(file as File);
  };

  const handleSubmit = async (values: Omit<Banner, "id">) => {
    if (!file && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append("order", values.order?.toString());

    if (values.categoryId) {
      formData.append("categoryId", values.categoryId.toString());
    }

    if (file) {
      formData.append("image", file as Blob);
    }

    try {
      const response: any = isEditing
        ? await handleAPI(`/api/banners/${banner?.id}`, "put", formData, {
            "Content-Type": "multipart/form-data",
          })
        : await handleAPI("/api/banners", "post", formData, {
            "Content-Type": "multipart/form-data",
          });

      if (response) {
        message.success(
          `Banner ${isEditing ? "updated" : "added"} successfully!`
        );
        onSuccess(response);
        onClose();
        form.resetFields();
        setFile(null);
      }
    } catch (error) {
      message.error(`Error ${isEditing ? "updating" : "adding"} banner`);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    cropPixels: Area
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not get canvas context");

    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob!], "cropped.png", { type: "image/png" });
        resolve(file);
      }, "image/png");
    });
  };

  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleCrop = async () => {
    if (selectedFile && croppedAreaPixels) {
      const cropped = await getCroppedImg(selectedFile, croppedAreaPixels);
      setCroppedImage(cropped);
      setFile(cropped);
      setCropModalVisible(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Banner" : "Add Banner"}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Category (Menu Item)"
          name="categoryId"
          tooltip="Select a category to display this banner on specific pages. Leave empty for homepage."
        >
          <Select
            placeholder="Select category (optional)"
            allowClear
            loading={loadingCategories}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: null, label: "Homepage (No Category)" },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              })),
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Order"
          name="order"
          rules={[
            { required: true, message: "Please enter the banner order!" },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Enter display order"
          />
        </Form.Item>
        <Form.Item label="Upload Image" name="image">
          <Upload.Dragger
            name="image"
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
        <Form.Item>
          {isEditing ? (
            <Button type="primary" htmlType="submit">
              Update Banner
            </Button>
          ) : (
            <Flex gap={8}>
              <Button type="primary" htmlType="submit">
                Add Banner
              </Button>
              <Button
                type="dashed"
                icon={<RedoOutlined />}
                onClick={() => form.resetFields()}
              >
                Clear
              </Button>
            </Flex>
          )}
        </Form.Item>
      </Form>

      <Modal
        open={cropModalVisible}
        onCancel={() => setCropModalVisible(false)}
        onOk={handleCrop}
        title="Crop Image"
        width={400}
      >
        <div style={{ position: "relative", height: 300, background: "#333" }}>
          {selectedFile && (
            <Cropper
              image={selectedFile}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
      </Modal>
    </Modal>
  );
};

export default BannerForm;
