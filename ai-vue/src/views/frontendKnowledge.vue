<template>
    <div class="knowlege-container">
        <div class="header-section">
            <div class="header-content">
                <el-image :src="iconUrl" style="width: 60px; height: 60px;"></el-image>
                <h1>知识库</h1>
            </div>
        </div>
        <div class="content">
            <!-- 左侧推荐列表 -->
            <div class="recommend-section">
                <div class="section-title">推荐阅读</div>
                <div class="recommend-list">
                    <div v-for="item in recommendList" :key="item.id" class="recommend-item" @click="goToArticle(item.id)">
                        <h4>{{ item.title }}</h4>
                        <p class="read-count">
                            <el-icon>
                                <Histogram />
                            </el-icon>
                            阅读量 {{ item.readCount }}
                        </p>
                    </div>
                </div>
            </div>
            <!-- 右侧文章列表 -->
            <div class="article-list">
                <div v-for="item in articleList" :key="item.id" class="article-item" @click="goToArticle(item.id)">
                    <el-image :src="getImage(item.coverImage)" style="width: 200px; height: 100px;"></el-image>
                    <div class="info">
                        <div class="title">
                            <h3>{{ item.title }}</h3>
                            <el-tag plain type="primary">{{ item.tags }}</el-tag>
                        </div>
                        <div :style="{ marginTop: '10px' }">
                            <div class="flex-box">
                                <el-icon>
                                    <Avatar />
                                </el-icon>
                                <span>{{ item.authorName }}</span>
                            </div>
                            <div class="flex-box">
                                <el-icon>
                                    <List />
                                </el-icon>
                                <span>{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</span>
                            </div>
                        </div>
                        <div :style="{ marginTop: '10px' }">
                            <div class="flex-box">
                                <el-icon>
                                    <Platform />
                                </el-icon>
                                <span>阅读量 {{ item.readCount }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <div class="pagination-wrapper">
            <el-pagination style="margin-top: 25px;" layout="prev, pager, next" :total="pagination.total"
                :page-size="pagination.size" @change="handleChange" />
        </div>
    </div>
</template>

<script setup>
import { dayjs } from 'element-plus'
import { ref, onMounted, reactive } from 'vue'
import { Histogram, Avatar, List, Platform } from '@element-plus/icons-vue'
import { getKnowledgeList } from '@/api/frontend'
import bookImage from '@/assets/images/book.png'
import defaultArticleImage from '@/assets/images/default.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const iconUrl = bookImage

// 推荐阅读列表
const recommendList = ref([])

// 文章列表分页
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})
// 文章列表
const articleList = ref([])

//获取文章列表数据
const gatPageList = () => {
    const params = {
        sortField: 'publishedAt',
        sortDirection: 'desc',
        ...pagination
    }
    getKnowledgeList(params).then(res => {
        articleList.value = res.data.records
        pagination.total = res.data.total
    })
}

// 获取文章封面图片
const getImage = (url) => {
    return url ? 'http://36.138.103.18:38180' + url : defaultArticleImage
}

// 分页切换
const handleChange = (page) => {
    pagination.currentPage = page
    gatPageList()
}

//跳转到详情页面
const goToArticle = (id) =>{
    console.log('点击文章，ID:', id)
    console.log('跳转路径:', `/customer/knowledge/article/${id}`)
    router.push(`/customer/knowledge/article/${id}`)
}
onMounted(() => {
    // 获取推荐阅读列表
    const params = {
        sortField: 'readCount',
        sortDirection: 'desc',
        currentPage: 1,
        size: 5
    }
    gatPageList()
    getKnowledgeList(params).then(res => {
        recommendList.value = res.data.records
    })
})
</script>

<style scoped>
.knowlege-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.header-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 24px;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-content h1 {
    color: #fff;
    margin: 0;
    font-size: 28px;
    font-weight: 600;
}

.content {
    display: flex;
    gap: 24px;
    margin-bottom: 24px;
}

.recommend-section {
    width: 300px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    height: fit-content;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 2px solid #667eea;
}

.recommend-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.recommend-item {
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.recommend-item:hover {
    background: #e9ecef;
    transform: translateX(4px);
}

.recommend-item h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.read-count {
    margin: 0;
    font-size: 12px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 4px;
}

.article-list {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.article-item {
    display: flex;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    transition: all 0.3s;
}

.article-item:last-child {
    border-bottom: none;
}

.article-item:hover {
    background: #f8f9fa;
    margin: 0 -24px;
    padding: 20px 24px;
    border-radius: 8px;
}

.article-item .info {
    flex: 1;
}

.title {
    display: flex;
    align-items: center;
    gap: 12px;
}

.title h3 {
    margin: 0;
    font-size: 18px;
    color: #333;
}

.flex-box {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
