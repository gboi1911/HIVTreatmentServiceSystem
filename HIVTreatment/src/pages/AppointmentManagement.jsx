import React, { useState, useEffect } from "react";
import { Table, Select, message, Tag } from "antd";
import dayjs from "dayjs";
import {
  getAllAppointments,
  getAppointmentsByStatus,
  updateAppointmentStatus,
} from "../api/appointment";

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
      await updateAppointmentStatus(appointmentId, newStatus, token);
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
      <h2
        style={{ color: "black" }}
        className="text-2xl font-semibold mb-6 text-center"
      >
        Quản lý lịch hẹn
      </h2>
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
    </div>
  );
}
