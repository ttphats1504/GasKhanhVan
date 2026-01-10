import { Form, Input, message, Modal, Select } from "antd";
import { useState } from "react";
import handleAPI from "../../apis/handleAPI";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddAdminUserModal = ({ visible, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await handleAPI("/api/admin-users", "post", values);
      if (res.success) {
        message.success("Admin user added successfully");
        form.resetFields();
        onClose();
        onSuccess();
      }
    } catch (error: any) {
      message.error(error.message || "Failed to add admin user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Admin User"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input email!" },
            { type: "email", message: "Please input valid email!" },
          ]}
        >
          <Input placeholder="admin@example.com" />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          initialValue="admin"
          rules={[{ required: true, message: "Please select role!" }]}
        >
          <Select>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="editor">Editor</Select.Option>
            <Select.Option value="super_admin">Super Admin</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
