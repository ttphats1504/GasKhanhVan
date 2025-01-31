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
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface Cylinder {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  createdAt: string;
}

const GasCylinderTable: React.FC = () => {
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Fetch data from the backend (mock data for now)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCylinders([
        {
          id: 1,
          name: "Oxygen Cylinder",
          type: "Medical",
          price: 50,
          stock: 100,
          image: "https://via.placeholder.com/150",
          description: "High-quality oxygen cylinder for medical use.",
          createdAt: "2023-10-01",
        },
        {
          id: 2,
          name: "Nitrogen Cylinder",
          type: "Industrial",
          price: 80,
          stock: 50,
          image: "https://via.placeholder.com/150",
          description: "Industrial-grade nitrogen cylinder.",
          createdAt: "2023-10-02",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle delete action
  const handleDelete = (id: number) => {
    setCylinders(cylinders.filter((cylinder) => cylinder.id !== id));
    message.success("Cylinder deleted successfully!");
  };

  // Handle edit action
  const handleEdit = (id: number) => {
    const cylinderToEdit = cylinders.find((cylinder) => cylinder.id === id);
    message.info(`Editing cylinder: ${cylinderToEdit?.name}`);
    // Add your edit logic here (e.g., open a modal with a form)
  };

  // Show modal for adding a new cylinder
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = (values: Omit<Cylinder, "id" | "createdAt">) => {
    const newCylinder = {
      id: cylinders.length + 1, // Generate a new ID (replace with backend logic)
      ...values,
      createdAt: new Date().toISOString().split("T")[0], // Add creation date
    };
    setCylinders([...cylinders, newCylinder]);
    message.success("Cylinder added successfully!");
    setIsModalVisible(false);
    form.resetFields();
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
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
          src={image}
          alt="cylinder"
          style={{ width: "50px", height: "50px" }}
        />
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Cylinder) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this cylinder?"
            onConfirm={() => handleDelete(record.id)}
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

  return (
    <Card
      title="Manage Gas Cylinders"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
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
        visible={isModalVisible}
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
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please enter the image URL!" }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please enter the cylinder description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter cylinder description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default GasCylinderTable;
