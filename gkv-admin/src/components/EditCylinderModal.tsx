import { Modal, Form, Input, Upload, Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";

interface CylinderDetails {
  name: string;
  type: string;
  price: number;
  stock: number;
  image?: string;
  description: string;
}

interface EditCylinderModalProps {
  isModalEditVisible: boolean;
  handleCancel: () => void;
  handleSubmit: (values: any) => void;
  cylinderDetails: CylinderDetails | null | undefined;
}

const EditCylinderModal: React.FC<EditCylinderModalProps> = ({
  isModalEditVisible,
  handleCancel,
  handleSubmit,
  cylinderDetails,
}) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState<string>(
    cylinderDetails?.description || ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    cylinderDetails?.image
  );

  useEffect(() => {
    if (cylinderDetails) {
      form.setFieldsValue({
        name: cylinderDetails.name,
        type: cylinderDetails.type,
        price: cylinderDetails.price,
        stock: cylinderDetails.stock,
        image: cylinderDetails.image,
        description: cylinderDetails.description,
      });
      setDescription(cylinderDetails.description || "");
      setImageUrl(cylinderDetails.image);
    }
  }, [cylinderDetails, form]);

  const handleFileChange = ({ file }: { file: File }) => {
    setFile(file);
    // Generate preview URL for the image
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setImageUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageUrl(undefined);
  };

  return (
    <Modal
      title="Edit Cylinder"
      open={isModalEditVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter the cylinder name!" },
          ]}
        >
          <Input placeholder="Enter cylinder name" />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[
            { required: true, message: "Please enter the cylinder type!" },
          ]}
        >
          <Input placeholder="Enter cylinder type" />
        </Form.Item>

        <Form.Item
          label="Price ($)"
          name="price"
          rules={[
            { required: true, message: "Please enter the cylinder price!" },
          ]}
        >
          <Input type="number" placeholder="Enter cylinder price" />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            { required: true, message: "Please enter the stock quantity!" },
          ]}
        >
          <Input type="number" placeholder="Enter stock quantity" />
        </Form.Item>

        <Form.Item
          label="Upload Image"
          name="image"
          rules={[{ required: true, message: "Please upload an image!" }]}
        >
          <Upload.Dragger
            name="image"
            beforeUpload={(file) => {
              handleFileChange({ file });
              return false; // Prevent automatic upload
            }}
            maxCount={1}
            onRemove={handleRemoveImage}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p>Click or drag file to upload</p>
          </Upload.Dragger>
          {/* Display image preview */}
          {imageUrl && (
            <div style={{ marginTop: 16 }}>
              <Image
                width={200}
                src={`${process.env.REACT_APP_BASE_URL}/${imageUrl}`}
                alt="Uploaded Image Preview"
                preview={false}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item label="Description" name="description">
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Enter cylinder description"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCylinderModal;
