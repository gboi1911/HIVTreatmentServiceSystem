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
  Popconfirm
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
import { useNavigate } from 'react-router-dom';
import { 
  getMedicalRecords, 
  getMedicalRecordsByCustomer,
  getMedicalRecordsByDoctor,
  getMedicalRecordsByCd4Range,
  getMedicalRecordsByViralLoadRange,
  deleteMedicalRecord 
} from '../../api/medicalRecord';
import { formatDate } from '../../utils/formatDate';

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

  // Delete medical record
  const handleDelete = async (recordId) => {
    try {
      await deleteMedicalRecord(recordId);
      message.success('Xóa hồ sơ bệnh án thành công');
      loadMedicalRecords();
    } catch (error) {
      message.error('Không thể xóa hồ sơ bệnh án');
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
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => `#${id}`,
    },
    {
      title: 'Bệnh nhân',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.customerId}
          </div>
        </div>
      ),
    },
    {
      title: 'Bác sĩ phụ trách',
      dataIndex: 'doctorName',
      key: 'doctorName',
      ellipsis: true,
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.doctorId}
          </div>
        </div>
      ),
    },
    {
      title: 'CD4 Count',
      dataIndex: 'cd4Count',
      key: 'cd4Count',
      width: 120,
      sorter: (a, b) => a.cd4Count - b.cd4Count,
      render: (count) => (
        <div style={{ textAlign: 'center', fontWeight: 500 }}>
          {count}
        </div>
      ),
    },
    {
      title: 'Viral Load',
      dataIndex: 'viralLoad',
      key: 'viralLoad',
      width: 120,
      sorter: (a, b) => a.viralLoad - b.viralLoad,
      render: (load) => (
        <div style={{ textAlign: 'center', fontWeight: 500 }}>
          {load?.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.cd4Count, record.viralLoad),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => formatDate(date),
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
              onClick={() => navigate(`/medical-records/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/medical-records/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa hồ sơ bệnh án"
            description="Bạn có chắc chắn muốn xóa hồ sơ này không?"
            onConfirm={() => handleDelete(record.id)}
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
                  onClick={() => navigate('/medical-records/new')}
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
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
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
    </div>
  );
};

export default MedicalRecords;
