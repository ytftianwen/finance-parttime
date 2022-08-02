import { UploadOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, message, Upload } from 'antd'
import { useState } from 'react'
import * as xlsx from 'xlsx'
import { run } from '../utils/excel'
function Pages(props: { handleSuccess: () => void }) {
  const [formData, setFormData] = useState<{
    time: any
    wb: any
    fileList: any[]
  }>({
    time: [],
    wb: null,
    fileList: [],
  })
  return (
    <Card>
      <Form.Item name="time" label="选择时间">
        <DatePicker.RangePicker
          size="large"
          value={formData.time}
          onChange={(val) => {
            setFormData({
              ...formData,
              time: [
                val?.[0]?.format('YYYY-MM-DD'),
                val?.[1]?.format('YYYY-MM-DD'),
              ],
            })
          }}
        />
      </Form.Item>

      <Form.Item name="file" label="选择文件">
        <Upload
          type="select"
          fileList={formData.fileList}
          beforeUpload={(file, fileList) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const wb = xlsx.read(e.target?.result, { type: 'binary' })
              setFormData({
                ...formData,
                wb: wb,
              })
            }
            reader.readAsBinaryString(fileList[0])
          }}
          onChange={(e) =>
            setFormData({
              ...formData,
              fileList: e.fileList,
            })
          }
        >
          <Button
            style={{ width: 267 }}
            htmlType="button"
            block
            icon={<UploadOutlined />}
            size="large"
          >
            选择Excel文件
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button
          size="large"
          block
          htmlType="button"
          type="primary"
          disabled={!formData.wb || !formData.time?.[0] || !formData.time?.[1]}
          onClick={() => {
            run({
              wb: formData.wb,
              startTime: formData.time?.[0],
              endTime: formData.time?.[1],
            })
            message.success('文件已下载')
            props.handleSuccess()
          }}
        >
          开始生成
        </Button>
      </Form.Item>
    </Card>
  )
}

export default () => {
  const [key, setKey] = useState(0)
  return (
    <Pages
      key={key}
      handleSuccess={() => {
        setKey(key + 1)
      }}
    />
  )
}
