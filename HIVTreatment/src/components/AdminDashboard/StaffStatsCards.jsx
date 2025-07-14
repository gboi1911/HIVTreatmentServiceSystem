import React from 'react';
import { Card, Row, Col } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';

export const StaffStatsCards = ({ staffStats }) => {
  const statsConfig = [
    {
      title: 'Tổng nhân viên',
      value: staffStats.total,
      icon: TeamOutlined,
      color: 'blue'
    },
    {
      title: 'Đang hoạt động',
      value: staffStats.active,
      icon: UserOutlined,
      color: 'green'
    },
    {
      title: 'Nam',
      value: staffStats.male,
      icon: UserOutlined,
      color: 'blue'
    },
    {
      title: 'Nữ',
      value: staffStats.female,
      icon: UserOutlined,
      color: 'pink'
    }
  ];

  return (
    <Row gutter={[16, 16]} className="mb-6">
      {statsConfig.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <div className="flex items-center">
                <div className={`bg-${stat.color}-100 p-3 rounded-lg mr-4`}>
                  <IconComponent className={`text-2xl text-${stat.color}-600`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-500">{stat.title}</div>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};
