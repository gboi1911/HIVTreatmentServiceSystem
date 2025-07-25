import React, { useState } from 'react';
import { List, Input, Button, Card, Typography } from 'antd';

const { TextArea } = Input;
const { Title } = Typography;

const mockConversations = [
  { id: 1, name: 'Nguyễn Văn A (Bệnh nhân)', messages: [
    { from: 'doctor', text: 'Chào bạn, bạn có thắc mắc gì về đơn thuốc không?' },
    { from: 'patient', text: 'Dạ bác sĩ, em muốn hỏi về tác dụng phụ.' },
  ] },
  { id: 2, name: 'Trần Thị B (Staff)', messages: [
    { from: 'doctor', text: 'Bạn kiểm tra giúp tôi kết quả xét nghiệm nhé.' },
    { from: 'staff', text: 'Vâng, tôi sẽ gửi bác sĩ sớm.' },
  ] },
];

const Communication = () => {
  const [selectedId, setSelectedId] = useState(mockConversations[0].id);
  const [input, setInput] = useState('');
  const selectedConversation = mockConversations.find(c => c.id === selectedId);

  const handleSend = () => {
    // Chỉ mockup, không gửi thực tế
    setInput('');
  };

  return (
    <div style={{ display: 'flex', padding: 24, gap: 24 }}>
      <Card style={{ minWidth: 250, maxWidth: 300 }}>
        <Title level={4}>Hội thoại</Title>
        <List
          dataSource={mockConversations}
          renderItem={item => (
            <List.Item
              style={{ cursor: 'pointer', background: item.id === selectedId ? '#e6f7ff' : undefined }}
              onClick={() => setSelectedId(item.id)}
            >
              {item.name}
            </List.Item>
          )}
        />
      </Card>
      <Card style={{ flex: 1 }}>
        <Title level={4}>{selectedConversation.name}</Title>
        <div style={{ minHeight: 200, marginBottom: 16 }}>
          {selectedConversation.messages.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.from === 'doctor' ? 'right' : 'left', margin: '4px 0' }}>
              <span style={{ background: msg.from === 'doctor' ? '#bae7ff' : '#f5f5f5', padding: '6px 12px', borderRadius: 8 }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <Input.Group compact>
          <TextArea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={2}
            style={{ width: 'calc(100% - 100px)' }}
            placeholder="Nhập tin nhắn..."
          />
          <Button type="primary" onClick={handleSend} style={{ width: 100, marginLeft: 8 }}>
            Gửi
          </Button>
        </Input.Group>
      </Card>
    </div>
  );
};

export default Communication; 