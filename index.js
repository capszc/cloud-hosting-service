const express = require('express');
const app = express();
const cloud = require('wx-server-sdk'); // 微信云开发 SDK

// 初始化微信云环境
cloud.init({
  env: process.env.WX_CLOUD_ENV // 自动获取云托管环境 ID
});

const db = cloud.database(); // 初始化数据库

app.use(express.json()); // 解析 JSON 请求体

// 测试接口（GET 请求根路径）
app.get('/', (req, res) => {
  res.send({ message: 'Hello from Cloud Hosting Service!', timestamp: new Date() });
});

// 接收 4G 设备上传的数据
app.post('/uploadData', async (req, res) => {
  const { floatData } = req.body; // 假设 4G 设备发送 {"floatData": 123.45}

  if (!floatData) {
    return res.status(400).send({ success: false, message: 'Invalid data', timestamp: new Date() });
  }

  try {
    // 将浮点数存储到云数据库
    const result = await db.collection('float_data').add({
      data: {
        value: floatData,
        timestamp: new Date() // 添加时间戳
      }
    });

    res.send({
      success: true,
      message: 'Data stored successfully',
      receivedData: { floatData },
      dbResult: result,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('存储数据失败:', err);
    res.status(500).send({ success: false, message: 'Failed to store data', error: err.message, timestamp: new Date() });
  }
});

// 启动服务
const PORT = process.env.PORT || 3000; // 云托管会自动设置 PORT 环境变量
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});