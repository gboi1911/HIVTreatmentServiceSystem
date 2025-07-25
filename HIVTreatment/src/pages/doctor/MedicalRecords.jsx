import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Card, 
  Tooltip, 
  Input, 
  Select, 
  DatePicker, 
  Row, 
  Col, 
  message,
  Modal,
  Popconfirm,
  Form,
  Descriptions
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getMedicalRecords, 
  getMedicalRecordsByCustomer,
  getMedicalRecordsByDoctor,
  getMedicalRecordsByCd4Range,
  getMedicalRecordsByViralLoadRange,
  deleteMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord
} from '../../api/medicalRecord';
import { formatDate } from '../../utils/formatDate';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [cd4Range, setCd4Range] = useState([null, null]);
  const [viralLoadRange, setViralLoadRange] = useState([null, null]);
  const [dateRange, setDateRange] = useState([null, null]);
  const navigate = useNavigate();
  const location = useLocation();

  // Add modal state and form
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const openModal = (record = null) => {
    setEditingRecord(record);
    setModalVisible(true);
    if (record) {
      form.setFieldsValue({
        ...record,
        lastUpdated: record.lastUpdated ? moment(record.lastUpdated) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = async (values) => {
    // Construct payload for backend
    const payload = {
      customerId: values.customerId,
      doctorId: 1,
      cd4Count: values.cd4Count,
      viralLoad: values.viralLoad,
      treatmentHistory: values.treatmentHistory,
      cd4Status: values.cd4Status,
      viralLoadStatus: values.viralLoadStatus,
      treatmentPlanCount: 0,
      labResultCount: 0,
    };
    setLoading(true);
    try {
      if (editingRecord) {
        await updateMedicalRecord(editingRecord.medicalRecordId, payload);
        message.success('Cập nhật hồ sơ bệnh án thành công');
      } else {
        const medicalRecord = await createMedicalRecord({
          customerId: Number(values.customerId),
          doctorId: Number(values.doctorId),
          cd4Count: Number(values.cd4Count),
          viralLoad: Number(values.viralLoad),
          treatmentHistory: values.treatmentHistory || ''
        });
        message.success('Tạo hồ sơ bệnh án thành công');
      }
      handleModalClose();
      await loadMedicalRecords();
    } catch (error) {
      message.error('Lưu hồ sơ bệnh án thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Load medical records
  const loadMedicalRecords = async () => {
    setLoading(true);
    try {
      let data = [];
      
      switch (filterType) {
        case 'cd4-range':
          if (cd4Range[0] !== null && cd4Range[1] !== null) {
            data = await getMedicalRecordsByCd4Range(cd4Range[0], cd4Range[1]);
          } else {
            data = await getMedicalRecords();
          }
          break;
        case 'viral-load-range':
          if (viralLoadRange[0] !== null && viralLoadRange[1] !== null) {
            data = await getMedicalRecordsByViralLoadRange(viralLoadRange[0], viralLoadRange[1]);
          } else {
            data = await getMedicalRecords();
          }
          break;
        default:
          data = await getMedicalRecords();
      }
      
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading medical records:', error);
      message.error('Không thể tải danh sách hồ sơ bệnh án');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicalRecords();
  }, [filterType, cd4Range, viralLoadRange]);

  // Prefill khi truy cập từ appointment
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const customerId = params.get('customerId');
    const appointmentId = params.get('appointmentId');
    if (location.pathname.endsWith('/create') && customerId) {
      setEditingRecord(null);
      setModalVisible(true);
      form.setFieldsValue({ customerId });
    }
  }, [location, form]);

  // Delete medical record
  const handleDelete = async (recordId) => {
    setLoading(true);
    try {
      await deleteMedicalRecord(recordId);
      message.success('Xóa hồ sơ bệnh án thành công');
      await loadMedicalRecords();
    } catch (error) {
      message.error('Không thể xóa hồ sơ bệnh án');
    } finally {
      setLoading(false);
    }
  };

  // Get status tag based on CD4 count and viral load
  const getStatusTag = (cd4Count, viralLoad) => {
    if (cd4Count < 200) {
      return <Tag color="red">Nguy hiểm</Tag>;
    } else if (cd4Count < 350) {
      return <Tag color="orange">Cần theo dõi</Tag>;
    } else if (viralLoad < 50) {
      return <Tag color="green">Ổn định</Tag>;
    } else {
      return <Tag color="blue">Bình thường</Tag>;
    }
  };

  // Filter records based on search text
  const filteredRecords = records.filter(record => {
    const searchLower = searchText.toLowerCase();
    return (
      record.customerName?.toLowerCase().includes(searchLower) ||
      record.doctorName?.toLowerCase().includes(searchLower) ||
      record.diagnosis?.toLowerCase().includes(searchLower) ||
      record.treatmentHistory?.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'medicalRecordId',
      key: 'medicalRecordId',
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Mã bác sĩ',
      dataIndex: 'doctorId',
      key: 'doctorId',
    },
    {
      title: 'Tên bác sĩ',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Số lượng CD4',
      dataIndex: 'cd4Count',
      key: 'cd4Count',
    },
    {
      title: 'Tải lượng virus',
      dataIndex: 'viralLoad',
      key: 'viralLoad',
    },
    {
      title: 'Lịch sử điều trị',
      dataIndex: 'treatmentHistory',
      key: 'treatmentHistory',
    },
    {
      title: 'Trạng thái CD4',
      dataIndex: 'cd4Status',
      key: 'cd4Status',
    },
    {
      title: 'Trạng thái tải lượng virus',
      dataIndex: 'viralLoadStatus',
      key: 'viralLoadStatus',
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text) => text ? moment(text).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => openDetailModal(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa hồ sơ bệnh án"
            description="Bạn có chắc chắn muốn xóa hồ sơ này không?"
            onConfirm={() => handleDelete(record.planId)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const openDetailModal = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };
  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedRecord(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
                Quản lý Hồ sơ Bệnh án
              </h2>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                Quản lý thông tin hồ sơ bệnh án của bệnh nhân HIV
              </p>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadMedicalRecords}
                  loading={loading}
                >
                  Tải lại
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => message.info('Chức năng xuất dữ liệu đang phát triển')}
                >
                  Xuất Excel
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal()}
                >
                  Tạo hồ sơ mới
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Tìm kiếm bệnh nhân, bác sĩ..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Loại lọc"
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
              >
                <Option value="all">Tất cả</Option>
                <Option value="cd4-range">Theo CD4 Count</Option>
                <Option value="viral-load-range">Theo Viral Load</Option>
              </Select>
            </Col>
            {filterType === 'cd4-range' && (
              <Col xs={24} sm={12} md={6}>
                <Input.Group compact>
                  <Input
                    style={{ width: '45%' }}
                    placeholder="CD4 min"
                    type="number"
                    value={cd4Range[0]}
                    onChange={(e) => setCd4Range([Number(e.target.value), cd4Range[1]])}
                  />
                  <Input
                    style={{ width: '10%', textAlign: 'center', border: 'none' }}
                    value="~"
                    disabled
                  />
                  <Input
                    style={{ width: '45%' }}
                    placeholder="CD4 max"
                    type="number"
                    value={cd4Range[1]}
                    onChange={(e) => setCd4Range([cd4Range[0], Number(e.target.value)])}
                  />
                </Input.Group>
              </Col>
            )}
            {filterType === 'viral-load-range' && (
              <Col xs={24} sm={12} md={6}>
                <Input.Group compact>
                  <Input
                    style={{ width: '45%' }}
                    placeholder="VL min"
                    type="number"
                    value={viralLoadRange[0]}
                    onChange={(e) => setViralLoadRange([Number(e.target.value), viralLoadRange[1]])}
                  />
                  <Input
                    style={{ width: '10%', textAlign: 'center', border: 'none' }}
                    value="~"
                    disabled
                  />
                  <Input
                    style={{ width: '45%' }}
                    placeholder="VL max"
                    type="number"
                    value={viralLoadRange[1]}
                    onChange={(e) => setViralLoadRange([viralLoadRange[0], Number(e.target.value)])}
                  />
                </Input.Group>
              </Col>
            )}
          </Row>
        </Card>

        {/* Table */}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          pagination={{
            total: filteredRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} hồ sơ`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingRecord ? 'Chỉnh sửa hồ sơ bệnh án' : 'Tạo hồ sơ bệnh án mới'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="customerId"
            label="Mã khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập mã khách hàng' }]}
          >
            <Input placeholder="Nhập mã khách hàng" type="number" />
          </Form.Item>
          <Form.Item
            name="customerName"
            label="Tên khách hàng"
            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
          >
            <Input placeholder="Nhập tên khách hàng" />
          </Form.Item>
          <Form.Item
            name="doctorId"
            label="Mã bác sĩ"
            rules={[{ required: true, message: 'Vui lòng nhập mã bác sĩ' }]}
          >
            <Input placeholder="Nhập mã bác sĩ" type="number" />
          </Form.Item>
          <Form.Item
            name="doctorName"
            label="Tên bác sĩ"
            rules={[{ required: true, message: 'Vui lòng nhập tên bác sĩ' }]}
          >
            <Input placeholder="Nhập tên bác sĩ" />
          </Form.Item>
          <Form.Item
            name="cd4Count"
            label="Số lượng CD4"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng CD4' }]}
          >
            <Input placeholder="Nhập số lượng CD4" type="number" />
          </Form.Item>
          <Form.Item
            name="viralLoad"
            label="Tải lượng virus"
            rules={[{ required: true, message: 'Vui lòng nhập tải lượng virus' }]}
          >
            <Input placeholder="Nhập tải lượng virus" type="number" />
          </Form.Item>
          <Form.Item
            name="treatmentHistory"
            label="Lịch sử điều trị"
            rules={[{ required: true, message: 'Vui lòng nhập lịch sử điều trị' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập lịch sử điều trị" />
          </Form.Item>
          <Form.Item
            name="cd4Status"
            label="Trạng thái CD4"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái CD4' }]}
          >
            <Select placeholder="Chọn trạng thái CD4">
              <Select.Option value="Normal">Bình thường</Select.Option>
              <Select.Option value="Mild">Giảm nhẹ</Select.Option>
              <Select.Option value="Moderate">Giảm vừa</Select.Option>
              <Select.Option value="Severe">Giảm nặng</Select.Option>
              <Select.Option value="Critical">Nguy kịch</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="viralLoadStatus"
            label="Trạng thái tải lượng virus"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái tải lượng virus' }]}
          >
            <Select placeholder="Chọn trạng thái tải lượng virus">
              <Select.Option value="Undetectable">Không phát hiện</Select.Option>
              <Select.Option value="Low">Thấp</Select.Option>
              <Select.Option value="Medium">Trung bình</Select.Option>
              <Select.Option value="High">Cao</Select.Option>
              <Select.Option value="Very high">Rất cao</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="lastUpdated"
            label="Cập nhật lần cuối"
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabled />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Button onClick={handleModalClose} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingRecord ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết hồ sơ bệnh án"
        open={detailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={700}
        destroyOnClose
      >
        {selectedRecord && (
          <Descriptions column={1} bordered size="middle">
            <Descriptions.Item label="Mã hồ sơ">{selectedRecord.medicalRecordId}</Descriptions.Item>
            <Descriptions.Item label="Mã khách hàng">{selectedRecord.customerId}</Descriptions.Item>
            <Descriptions.Item label="Tên khách hàng">{selectedRecord.customerName}</Descriptions.Item>
            <Descriptions.Item label="Mã bác sĩ">{selectedRecord.doctorId}</Descriptions.Item>
            <Descriptions.Item label="Tên bác sĩ">{selectedRecord.doctorName}</Descriptions.Item>
            <Descriptions.Item label="Số lượng CD4">{selectedRecord.cd4Count}</Descriptions.Item>
            <Descriptions.Item label="Tải lượng virus">{selectedRecord.viralLoad}</Descriptions.Item>
            <Descriptions.Item label="Lịch sử điều trị">{selectedRecord.treatmentHistory}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái CD4">{selectedRecord.cd4Status}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái tải lượng virus">{selectedRecord.viralLoadStatus}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">{selectedRecord.lastUpdated ? moment(selectedRecord.lastUpdated).format('DD/MM/YYYY HH:mm') : ''}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MedicalRecords;
