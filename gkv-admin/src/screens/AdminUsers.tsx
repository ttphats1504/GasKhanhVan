import { Button, Card, message, Modal, Space, Switch, Table, Tag } from "antd";
import { ColumnProps } from "antd/es/table";
import { useEffect, useState } from "react";
import handleAPI from "../apis/handleAPI";
import { AddAdminUserModal } from "./components/AddAdminUserModal";

interface AdminUser {
  id: number;
  email: string;
  role: "super_admin" | "admin" | "editor";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      const res: any = await handleAPI("/api/admin-users", "get");
      if (res.success) {
        setAdminUsers(res.data);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to fetch admin users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, is_active: boolean) => {
    try {
      const res: any = await handleAPI(`/api/admin-users/${id}`, "put", {
        is_active,
      });
      if (res.success) {
        message.success("Status updated successfully");
        fetchAdminUsers();
      }
    } catch (error: any) {
      message.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = (id: number, email: string) => {
    Modal.confirm({
      title: "Delete Admin User",
      content: `Are you sure you want to remove "${email}" from admin list?`,
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          const res: any = await handleAPI(`/api/admin-users/${id}`, "delete");
          if (res.success) {
            message.success("Admin user deleted successfully");
            fetchAdminUsers();
          }
        } catch (error: any) {
          message.error(error.message || "Failed to delete admin user");
        }
      },
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "red";
      case "admin":
        return "blue";
      case "editor":
        return "green";
      default:
        return "default";
    }
  };

  const columns: ColumnProps<AdminUser>[] = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {role.replace("_", " ").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active: boolean, record: AdminUser) => (
        <Switch
          checked={is_active}
          onChange={(checked) => handleToggleActive(record.id, checked)}
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: AdminUser) => (
        <Space>
          <Button
            danger
            size="small"
            onClick={() => handleDelete(record.id, record.email)}
            disabled={record.role === "super_admin"}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="Admin Users Management"
        extra={
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add Admin User
          </Button>
        }
      >
        <Table
          dataSource={adminUsers}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <AddAdminUserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchAdminUsers}
      />
    </div>
  );
};

export default AdminUsers;
