<template>
    <div>
        <PageHead pageTitle="知识文章">
            <template #buttons>
                <el-button type="primary" @click="handleEdit({})">新增</el-button>
            </template>
        </PageHead>
        <Tabelserch :formItem="formItem" @search="handleSearch"></Tabelserch>
        <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
            <el-table-column label="文章标题" fixed="left">
                <template #default="scope">
                   <div style="display: flex;align-items: center;">
                    <el-icon> <timer /></el-icon>
                    <span>{{scope.row.title}}</span>
                   </div>
                </template>
            </el-table-column>
            <el-table-column label="文章类型" width="200">
                <template #default="scope">
                    {{categoryMap[scope.row.categoryId] || scope.row.categoryId}}
                </template>
            </el-table-column>
            <el-table-column prop="authorName" label="作者" width="150"></el-table-column>
            <el-table-column prop="readCount" label="阅读量" width="150"></el-table-column>
            <el-table-column prop="updatedAt" label="发布时间" width="150"></el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
                <template #default="scope">
                   <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                   <el-button @click="handlePublish(scope.row)" v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
                   <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status === 1" text type="warning">下线</el-button>
                   <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 25px;"
            layout="prev, pager, next"
            :total="pagination.total"
            :page-size="pagination.size"
            @change="handleChange"
        />
        <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle"  :categories="categories" @success="handleSubmit"></ArticleDialog>
       </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import Tabelserch from '@/components/Tabelserch.vue'
import { categoryTree, articleList, getArticleDetail, deleteArticle, changeArticleStatus } from '@/api/admin'
import { onMounted, reactive, ref } from 'vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox, ElMessage } from 'element-plus'



// 生命周期钩子
// onMounted(() => {
//     categoryTree().then(data => {
//         console.log(data,'data')

//     })
// })

// 什么时候用ref，什么时候用reactive
// ref用于响应式数据，reactive用于响应式对象
// 当需要在模板中使用数据时，使用ref
// 当需要在模板中使用对象属性时，使用reactive

// 分类映射
const categoryMap = reactive({})
// 分类列表
const categories = ref([])
// 表格数据
const tableData = ref([])
// 弹窗状态
const dialogVisible = ref(false)

// 表单数据
const formItem = [
    {
        comp: 'input',
        prop: 'title',
        label: '文章标题',
        placeholder: '请输入文章标题'
    },
    {
        comp: 'select',
        prop: 'categoryId',
        label: '文章类型',
        placeholder: '请选择文章类型'
    },
    {
        comp: 'select',
        prop: 'status',
        label: '文章状态',
        placeholder: '请选择文章状态',
        options: [
            {
                label: '草稿',
                value: 0
            },
            {
                label: '已发布',
                value: 1
            },
            {
                label: '已下线',
                value: 2
            }
        ]
    }
]

// 分页改变时触发
const handleChange = (page) => {
    pagination.currentPage = page   
    handleSearch()
}

// 分页参数
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

// 状态映射
const statusMap = {
    0: '草稿',
    1: '已发布',
    2: '已下线'
}

const lastSearchParams = ref(null)

const handleSearch = async (formData) => {
    if (formData) {
        lastSearchParams.value = formData
    }

    const currentForm = formData || lastSearchParams.value
    // 合并分页参数和查询参数
    const params = {
        ...pagination,
        ...currentForm
    }

    // 过滤掉空字符串参数
    Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
        }
    })

    console.log('查询参数:', params)
    const res = await articleList(params)
    console.log('articleList响应:', res)
    
    // 提取数据，兼容多种返回格式
    const data = res?.data || res
    const records = Array.isArray(data?.records) ? data.records : (Array.isArray(data) ? data : [])
    tableData.value = records
    if (data?.total !== undefined) {
        pagination.total = data.total
    }
}

// 发布文章
const handlePublish = (row) => {
    // 确认发布
    ElMessageBox.confirm(`确认发布文章${row.title}吗？`, '确认', {
        confirmButtonText: '确定发布',
        cancelButtonText: '取消',
        type: 'info'
    }).then(() => {
    if(!row.id){
        return
    }
    changeArticleStatus(row.id,{status:1}).then(res => {
        ElMessage.success('发布成功')
        handleSearch()
    })
    })
}

// 下线文章
const handleUnpublish = (row) => {
    // 确认下线
    ElMessageBox.confirm(`确认下线文章${row.title}吗？`, '确认', {
        confirmButtonText: '确定下线',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
    if(!row.id){
        return
    }
    changeArticleStatus(row.id,{status:2}).then(res => {
        ElMessage.success('下线成功')
        handleSearch()
    })
    })
}

// 删除文章
const handleDelete = (row) => {
    // 确认删除
    ElMessageBox.confirm(`确认删除文章${row.title}吗？`, '确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'danger'
    }).then(() => {
    if(!row.id){
        return
    }
    deleteArticle(row.id).then(res => {
        ElMessage.success('删除成功')
        handleSearch()
    })
    })
}

onMounted(async () => {
    // 初始化分类映射
    const res = await categoryTree()
    // 提取数据，兼容多种返回格式
    const data = res?.data || res || []
    
    categories.value = data.map(item => {
        const categoryName = item.categoryName || item.name
        categoryMap[item.id] = categoryName
        return {
            label: categoryName,
            value: item.id
        }
    })
    formItem[1].options = categories.value

    // 初始化查询
    handleSearch()
})

// 提交表单
const handleSubmit = () => {
    dialogVisible.value = false
    currentArticle.value = null
    pagination.currentPage = 1
    handleSearch()
}

const currentArticle = ref(null)
const handleSuccess = () => {
    dialogVisible.value = false
    handleSearch()
}
// 编辑文章
const handleEdit = (row) => {
    if(!row.id){
        // 新增文章
        currentArticle.value = null
        dialogVisible.value = true
    } else {
        // 编辑文章
        getArticleDetail(row.id).then(res => {
            currentArticle.value = res.data
            dialogVisible.value = true
        })
    }
}
</script>


