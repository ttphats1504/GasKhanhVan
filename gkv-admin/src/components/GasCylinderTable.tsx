import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Input,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Upload,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

import handleAPI from "../apis/handleAPI";
import EditCylinderModal from "./EditCylinderModal";

interface Cylinder {
  _id: string;
  name: string;
  type: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  createdAt: string;
}

const fetchCylinderDatas = async () => {
  const api = "/api/cylinders";
  try {
    const res = await handleAPI(api, "get");
    return res;
  } catch (error) {
    console.error("Error fetching cylinders:", error);
    return [];
  }
};

const fetchCylinderById = async (id: string) => {
  try {
    const res = await handleAPI(`/api/cylinders/${id}`, "get");
    console.log("fetchCylinderById: ", res);
    return res;
  } catch (error) {
    console.error("Error fetching cylinders:", error);
    return null;
  }
};

const GasCylinderTable: React.FC = () => {
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [cylinderDetails, setCylinderDetails] = useState<Cylinder | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalAddVisible, setIsModalAddVisible] = useState<boolean>(false);
  const [isModalEditVisible, setIsModalEditVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [file, setFile] = useState<UploadFile | null>(null);
  const [description, setDescription] = useState<string>("");

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res: any = await fetchCylinderDatas(); // Call the function

      if (res && res.length > 0) {
        setCylinders(res);
      }

      setLoading(false);
    };

    fetchData(); // Call the async function inside useEffect
  }, []);

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await handleAPI(`/api/cylinders/${id}`, "delete");

      // Update UI by removing deleted item
      setCylinders((prevCylinders) =>
        prevCylinders.filter((cylinder) => cylinder._id !== id)
      );

      message.success("Cylinder deleted successfully!");
    } catch (error) {
      message.error("Error deleting cylinder");
    }
  };

  // Handle edit action
  const handleEdit = async (id: string) => {
    setIsModalEditVisible(true);
    setLoading(true);

    try {
      const res: any = await fetchCylinderById(id);

      if (res) {
        setCylinderDetails(res);
      } else {
        message.error("Cylinder not found!");
      }
    } catch (error) {
      message.error("Error fetching cylinder details");
      console.error("Error fetching cylinder:", error);
    }

    setLoading(false);
  };

  // Show modal for adding a new cylinder
  const showModalAdd = () => {
    setIsModalAddVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalAddVisible(false);
    setIsModalEditVisible(false);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values: Omit<Cylinder, "id" | "createdAt">) => {
    if (!file) {
      message.error("Please upload an image!");
      return;
    }
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("price", values.price.toString());
    formData.append("stock", values.stock.toString());
    formData.append("description", values.description);
    // Cast file to Blob safely
    const fileBlob = file as unknown as Blob;
    // Append file as Blob
    formData.append("image", fileBlob);

    try {
      const response: any = await handleAPI(
        "/api/cylinders",
        "post",
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response) {
        message.success("Cylinder added successfully!");
        setCylinders([...cylinders, response]); // Update table
        setIsModalAddVisible(false);
        form.resetFields();
        setFile(null);
      }
    } catch (error) {
      message.error("Error adding cylinder");
    }
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Price ($)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image: string) => (
        <img
          src={`${process.env.REACT_APP_BASE_URL}/${image}`}
          alt="cylinder"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <div dangerouslySetInnerHTML={{ __html: text }} />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleString("vi-VN", {
          hour12: false, // 24-hour format
        });
        return formattedDate;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Cylinder) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this cylinder?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const handleFileChange = ({ file }: any) => {
    setFile(file);
  };
  console.log("asdasd: ", cylinderDetails?.name);
  return (
    <Card
      title="Manage Gas Cylinders"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={showModalAdd}>
          Add New Cylinder
        </Button>
      }
      style={{ margin: "20px" }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input.Search
            placeholder="Search cylinders..."
            style={{ marginBottom: "20px", width: "300px" }}
          />
        </Col>
        <Col span={24}>
          <Table<Cylinder>
            columns={columns}
            dataSource={cylinders}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>

      {/* Add New Cylinder Modal */}
      <Modal
        title="Add New Cylinder"
        open={isModalAddVisible}
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
              onRemove={() => setFile(null)}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p>Click or drag file to upload</p>
            </Upload.Dragger>
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Edit Cylinder Modal */}
      <EditCylinderModal
        isModalEditVisible={isModalEditVisible}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        cylinderDetails={cylinderDetails}
      />
    </Card>
  );
};

export default GasCylinderTable;
