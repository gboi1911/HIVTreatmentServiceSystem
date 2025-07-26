import React, { useState, useEffect } from "react";
import { Table, Select, message, Tag, Card, Button, Space, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  getAllAppointments,
  getAppointmentsByStatus,
  updateAppointmentStatus,
} from "../api/appointment";
import { CalendarOutlined, BellOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AppointmentManagementPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const token = localStorage.getItem("token");

  const statusColors = {
    PENDING: "orange",
    CONFIRMED: "green",
    CANCELLED: "red",
    COMPLETED: "blue",
    NO_SHOW: "gray",
  };

  const typeColors = {
    ONLINE: "green",
    OFFLINE: "red",
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAllAppointments(token);
      setAppointments(data.data);
    } catch {
      message.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentsByStatus = async (status) => {
    try {
      setLoading(true);
      const data = await getAppointmentsByStatus(status, token);
      setAppointments(data.data);
    } catch {
      message.error("Không thể lọc lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus, '');
      message.success("Cập nhật trạng thái thành công");
      if (statusFilter) {
        fetchAppointmentsByStatus(statusFilter);
      } else {
        fetchAppointments();
      }
    } catch {
      message.error("Không thể cập nhật trạng thái");
    }
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerPhone",
      key: "customerPhone",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Chuyên khoa",
      dataIndex: "doctorSpecialty",
      key: "doctorSpecialty",
    },
    {
      title: "Hình thức",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const normalizedType = type?.toUpperCase(); // safe check with optional chaining
        return (
          <span
            style={{
              color: typeColors[normalizedType] || "black",
              fontWeight: "600",
            }}
          >
            {type}
          </span>
        );
      },
    },
    {
      title: "Thời gian",
      dataIndex: "datetime",
      key: "datetime",
      render: (datetime) => dayjs(datetime).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <>
          <Tag color={statusColors[status]}>{status}</Tag>
          <Select
            value={status}
            onChange={(value) =>
              handleStatusChange(record.appointmentId, value)
            }
            style={{ width: 140, marginLeft: 8 }}
          >
            {Object.keys(statusColors).map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </>
      ),
    },
  ];

  return (
    <div className="px-8 py-12">
      <Title level={2} style={{ marginBottom: 24 }}>
        Quản lý lịch hẹn
      </Title>
      
      {/* Quick Access Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card hoverable>
            <Link to="/staff/follow-up-management">
              <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                <BellOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                <Title level={4}>Quản lý tái khám</Title>
                <Text type="secondary">Lên lịch tái khám cho bệnh nhân sau khi hoàn thành điều trị</Text>
              </Space>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Link to="/staff/completed-treatments">
              <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <Title level={4}>Hồ sơ đã hoàn thành</Title>
                <Text type="secondary">Xem các hồ sơ bệnh án và phác đồ điều trị đã hoàn thành</Text>
              </Space>
            </Link>
          </Card>
        </Col>
        <Col span={8}>
          <Card hoverable>
            <Link to="/consultation-booking">
              <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                <CalendarOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                <Title level={4}>Đặt lịch mới</Title>
                <Text type="secondary">Tạo cuộc hẹn mới cho bệnh nhân với bác sĩ</Text>
              </Space>
            </Link>
          </Card>
        </Col>
      </Row>
      
      <Card title="Danh sách lịch hẹn" style={{ marginBottom: 16 }}>
        <div className="mb-4">
          <Select
            allowClear
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            onChange={(value) => {
              setStatusFilter(value);
              if (value) {
                fetchAppointmentsByStatus(value);
              } else {
                fetchAppointments();
              }
            }}
          >
            {["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"].map(
              (s) => (
                <Select.Option key={s} value={s}>
                  {s}
                </Select.Option>
              )
            )}
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="appointmentId"
          loading={loading}
        />
      </Card>
    </div>
  );
}
