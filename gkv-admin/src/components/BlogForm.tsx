// pages/admin/BlogForm.tsx
import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Modal, Upload, message, Switch} from 'antd'
import {UploadOutlined, RedoOutlined} from '@ant-design/icons'
import {UploadFile} from 'antd/es/upload/interface'
import handleAPI from '../apis/handleAPI'
import Blog from '../models/Blog'
import ReactQuill from 'react-quill'

interface BlogFormProps {
  visible: boolean
  onClose: () => void
  onSuccess: (blog: Blog) => void
  blog?: Blog | null
  mode?: 'add' | 'edit'
}

const BlogForm: React.FC<BlogFormProps> = ({visible, onClose, onSuccess, blog, mode = 'add'}) => {
  const [form] = Form.useForm()
  const [file, setFile] = useState<UploadFile | null>(null)
  const [content, setContent] = useState<string>('')

  const isEditing = mode === 'edit'
  console.log(isEditing)
  useEffect(() => {
    if (blog && isEditing) {
      form.setFieldsValue({
        ...blog,
      })
      setContent(blog.content || '')
    } else {
      form.resetFields()
      setContent('')
    }
  }, [blog, mode])

  const handleFileChange = ({file}: any) => {
    setFile(file)
  }

  const handleSubmit = async (values: any) => {
    const formData = new FormData()
    formData.append('title', values.title)
    formData.append('slug', values.slug)
    formData.append('author', values.author || '')
    formData.append('content', content)
    formData.append('published', values.published ? 'true' : 'false')

    if (file) {
      const fileBlob = file as unknown as Blob
      formData.append('thumbnail', fileBlob)
    }

    try {
      const response: any = isEditing
        ? await handleAPI(`/api/blogs/${blog?.id}`, 'put', formData, {
            'Content-Type': 'multipart/form-data',
          })
        : await handleAPI('/api/blogs', 'post', formData, {
            'Content-Type': 'multipart/form-data',
          })

      if (response) {
        message.success(`Blog ${isEditing ? 'updated' : 'added'} successfully!`)
        onSuccess(response)
        onClose()
        form.resetFields()
        setFile(null)
        setContent('')
      }
    } catch (error) {
      message.error(`Error ${isEditing ? 'updating' : 'adding'} blog`)
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Blog' : 'Add Blog'}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Form form={form} onFinish={handleSubmit} layout='vertical'>
        <Form.Item
          label='Title'
          name='title'
          rules={[{required: true, message: 'Please enter the blog title!'}]}
        >
          <Input placeholder='Enter blog title' />
        </Form.Item>

        <Form.Item
          label='Slug'
          name='slug'
          rules={[{required: true, message: 'Please enter slug!'}]}
        >
          <Input placeholder='auto-generate if empty' />
        </Form.Item>

        <Form.Item label='Author' name='author'>
          <Input placeholder='Enter author name' />
        </Form.Item>

        <Form.Item label='Upload Thumbnail' name='thumbnail'>
          <Upload.Dragger
            name='thumbnail'
            beforeUpload={(file) => {
              handleFileChange({file})
              return false
            }}
            maxCount={1}
            onRemove={() => setFile(null)}
          >
            <p className='ant-upload-drag-icon'>
              <UploadOutlined />
            </p>
            <p>Click or drag file to upload</p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label='Content' name='content'>
          <ReactQuill value={content} onChange={setContent} style={{minHeight: 200}} />
        </Form.Item>

        <Form.Item label='Published' name='published' valuePropName='checked'>
          <Switch />
        </Form.Item>

        <Form.Item>
          {isEditing ? (
            <Button type='primary' htmlType='submit'>
              Update Blog
            </Button>
          ) : (
            <>
              <Button type='primary' htmlType='submit'>
                Add Blog
              </Button>
              <Button
                type='dashed'
                icon={<RedoOutlined />}
                onClick={() => {
                  form.resetFields()
                  setContent('')
                  setFile(null)
                }}
                style={{marginLeft: 8}}
              >
                Clear
              </Button>
            </>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default BlogForm
