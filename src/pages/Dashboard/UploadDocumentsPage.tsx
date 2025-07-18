import React, { useState } from "react";
import { Upload, Table, message, Typography, Popconfirm, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import type { UploadProps } from "antd";
import type { RcFile, UploadRequestOption } from "rc-upload/lib/interface";

interface UploadedFile {
  name: string;
  createOn: string;
  id?: string;
}

const { Title } = Typography;

const UploadDocumentsPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Lấy danh sách file đã upload
  const fetchFiles = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
        }/assistant/files`
      );
      if (res.data?.data?.files) {
        setFiles(
          (
            res.data.data.files as Array<{
              name: string;
              createOn?: string;
              createdOn?: string;
              uploadedAt?: string;
              id?: string;
            }>
          ).map((f) => ({
            name: f.name,
            createOn: f.createOn || f.createdOn || f.uploadedAt || "",
            id: f.id,
          }))
        );
      }
    } catch (err) {
      message.error("Không thể tải danh sách file");

      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchFiles();
  }, []);

  // Xử lý upload file
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    customRequest: async (options: UploadRequestOption) => {
      const { file, onSuccess, onError } = options;
      const formData = new FormData();
      formData.append("file", file as RcFile);
      setUploading(true);
      try {
        await axios.post(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
          }/assistant/upload`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        message.success("Upload thành công!");
        fetchFiles();
        if (onSuccess) onSuccess({}, file);
      } catch (err) {
        message.error("Upload thất bại!");

        console.error(err);
        if (onError) onError(err as Error);
      } finally {
        setUploading(false);
      }
    },
    accept: ".pdf,.doc,.docx,.txt,.md",
  };

  // Xử lý xóa file
  const handleDelete = async (id?: string) => {
    if (!id) return;
    setDeletingId(id);
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
        }/assistant/files/${id}`
      );
      message.success("Xóa file thành công!");
      fetchFiles(); // Chỉ fetch lại dữ liệu, không reload trang
    } catch (err) {
      message.error("Xóa file thất bại!");

      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const columns = [
    {
      title: "Tên file",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createOn",
      key: "createOn",
      render: (date: string) => (date ? new Date(date).toLocaleString() : ""),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: unknown, record: UploadedFile) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa file này?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            loading={deletingId === record.id}
            size="small"
          >
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Upload tài liệu
      </Title>
      <Upload.Dragger
        {...uploadProps}
        disabled={uploading}
        style={{ marginBottom: 32 }}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined style={{ fontSize: 32 }} />
        </p>
        <p className="ant-upload-text">
          Nhấn hoặc kéo thả file vào đây để upload
        </p>
        <p className="ant-upload-hint">
          Hỗ trợ các định dạng: PDF, DOC, DOCX, TXT, MD
        </p>
      </Upload.Dragger>
      <Table
        columns={columns}
        dataSource={files.map((f, i) => ({ ...f, key: f.id || i }))}
        pagination={{ pageSize: 8 }}
        bordered
        title={() => <b>Danh sách tài liệu đã upload</b>}
        locale={{ emptyText: "Chưa có tài liệu nào" }}
      />
    </div>
  );
};

export default UploadDocumentsPage;
