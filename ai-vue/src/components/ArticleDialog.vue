<template>
      <el-dialog
        :title="isEdit ? '编辑文章' : '添加文章'"
        v-model="dialogVisible"
        width="50%"
        @close="handleClose"
      >
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable />
          </el-form-item>
          <el-form-item label="文章分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择文章分类">
              <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="文章摘要" prop="summary">
            <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要(可选)" maxlength="1000" :rows="4" show-word-limit clearable />
          </el-form-item>
          <el-form-item label="标签" prop="tags">
            <el-select v-model="formData.tagArray" placeholder="请选择标签" multiple filterable allow-create width="100%">
              <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="封面图片">
            <div class="cover-upload">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :before-upload="beforeUpload"
                    :http-request="handleUpload"
                    :show-file-list="false"
                    accept="image/*"
                >
                    <div v-if="!imgUrl" class="cover-placeholder">
                        <p>点击上传封面图片</p>
                    </div>
                    <img v-else :src="imgUrl" alt="封面图片" class="cover-image" @error="handlePreviewError" />
                </el-upload>
                <p v-if="uploadError" class="upload-error">{{ uploadError }}</p>
                <div v-if="imgUrl" class="cover-remove">
                  <el-button type="danger" size="small" @click="removeCover">删除</el-button>
                </div>  

            </div>
          </el-form-item>
          <el-form-item label="文章内容" prop="content">
            <RichTextEditor 
            v-model="formData.content"
            :maxCharCount="5000"
            @change="handleContentChange"
            @create="handleCreated"
            min-height="400px"
            ></RichTextEditor>
          </el-form-item>
        </el-form>
          <div v-if="BtnPreview">
            <h3>内容预览</h3>
            <div v-html="formData.content"></div>
          </div>
          <template #footer>
            <el-button @click="BtnPreview = !BtnPreview">{{BtnPreview ? '关闭预览' : '预览'}}</el-button>
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="loading">{{isEdit ? '更新' : '添加'}}</el-button>
          </template>
      </el-dialog>
</template>

<script setup>
import { ref, computed,reactive,nextTick,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/admin'
import RichTextEditor from '@/components/RichTextEditor.vue'
import { addArticle,updateArticle } from '@/api/admin'
import { getArticleCover, resolveFileUrl } from '@/utils/fileUrl'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  article: {
    type: Object,
    default: null
   }
})

const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit('update:modelValue', val)
  }
})

// 弹窗关闭时触发
const handleClose = () => {
  //重置表单
  formRef.value.resetFields()
  businessId.value = null
  formData.tagArray = []
  //删除封面图片
  removeCover()
  emit('update:modelValue', false)
}

const formData = reactive({
    title: '',
    content: '',
    coverImg: '',
    categoryId: 1,
    summary: '',
    tags: '',
    id: '',
    tagArray: []
})


const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' }
        ,{ max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'change' }
        ,{ max: 5000, message: '文章内容最多5000个字符', trigger: 'blur' }
    ],
 })

const commonTags = [
    '情绪管理','焦虑','抑郁','压力','睡眠',
    '冥想','正念','放松','心理健康','自我成长',
    '人际关系','工作压力','学习方法','生活技巧'
]

const imgUrl = ref('')
const uploadError = ref('')

const beforeUpload = (file) => {
    // 针对图片上传的校验
    const isImage = file.type.startsWith('image/')
    const isLt5MB = file.size / 1024 / 1024 < 5
    if (!isImage) {
      ElMessage.error('请上传图片格式的文件')
      return false
    }
    if (!isLt5MB) {
      ElMessage.error('图片大小不能超过5MB')
      return false
    }
    return true
}

const businessId = ref('')

const handleUpload = async ({file}) => {
  uploadError.value = ''
  businessId.value = crypto.randomUUID()
  const fileRes = await uploadFile(file,{businessId:businessId.value})  
  console.log(fileRes)

  const data = fileRes?.data || {}
  const filePath = data.filePath || data.url || data.fileUrl || data.path
  imgUrl.value = resolveFileUrl(filePath)
  formData.coverImg = filePath
}

const handlePreviewError = () => {
  uploadError.value = '封面预览失败。'
}

const removeCover = () => {
  imgUrl.value = ''
  formData.coverImg = ''
  uploadError.value = ''
}

const handleContentChange = (html) => {
  formData.content = html
}

const editorInstance = ref(null)

const handleCreated = (editor) => {
  editorInstance.value = editor
  if(formData.content && editor){
    nextTick(() => {
      editor.setHtml(formData.content)
    })
  }
}

const BtnPreview = ref(false)

const loading = ref(false)
const formRef = ref()

const handleSubmit = () => {
  formRef.value.validate((valid,fields) => {
    if (!valid) return
    loading.value = true
    dialogVisible.value = false
    // 对象解构赋值，将formData中的属性赋值给submitData，同时将tags转换为数组格式
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(','),
    }

    delete submitData.tagArray
    
    if(!isEdit.value){
      addArticle(submitData).then(res => {
        loading.value = false
        emit('success')
      }).catch(() => {
        loading.value = false
      })
    }else{
      updateArticle(props.article.id,submitData).then(res => {
        loading.value = false
        emit('success')
      }).catch(() => {
        loading.value = false
      })
    }
  })
}
  
const isEdit = computed(() => !!props.article?.id)

//监听编辑数据变化，更新formData
watch(() => props.article, (newVal) => {
  if(newVal){
    nextTick(() => {
      Object.assign(formData, newVal)
      //使用现有id
      businessId.value = newVal.id
      //封面url
      imgUrl.value = resolveFileUrl(getArticleCover(newVal))
      //将tags字符串转换为tagArray数组
      if(newVal.tags){
        formData.tagArray = newVal.tags.split(',').filter(tag => tag.trim())
      }
    })
  }
})
</script>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background: #f5f7fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  object-fit: cover;
  display: block;
}
.upload-error {
  margin: 8px 0 0;
  color: #f56c6c;
  font-size: 12px;
}
</style>
