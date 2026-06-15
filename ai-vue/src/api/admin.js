import service from '@/utils/request'

export function login(data) {
    return service.post('/user/login', data)
}

export function register(data) {
    return service.post('/user/register', data)
}

export function categoryTree() {
    return service.get('/knowledge/category/tree')
}

// axios对数组的请求参数的格式为params
export function articleList(params) {
    return service.get('/knowledge/article/page', {params})
}

export function uploadFile(file,businessInfo) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField','cover')

    return service.post('/file/upload', formData,{headers:{'Content-Type':'multipart/form-data'}})
}

export function addArticle(data) {
    return service.post('/knowledge/article', data)
}

export function getArticleDetail(id) {
    return service.get(`/knowledge/article/${id}`)
}

export function updateArticle(id,data) {
    return service.put(`/knowledge/article/${id}`,data)
}

export function changeArticleStatus(id,data) {
    return service.put(`/knowledge/article/${id}/status`,data)
}

export function deleteArticle(id) {
    return service.delete(`/knowledge/article/${id}`)
}

export function getConsultationPage(params) {
    return service.get('/psychological-chat/sessions', {params})
}

export function getSessionDetailDetail(sessionId) {
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

export function getEmotionalPage(params) {
    return service.get('/emotion-diary/admin/page', {params})
}

export function deleteEmotional(id) {
    return service.delete(`/emotion-diary/admin/${id}`)
}

export function logout() {
    return service.post('/user/logout')
}

export function getAnalyticsOverview() {
    return service.get(`/data-analytics/overview`)
}

export function updateAdminPassword(data) {
    return service.put('/user/password', data)
}

export function createAdmin(data) {
    return service.post('/user/admin', data)
}

export function sendResetPasswordCode(email) {
    return service.post('/user/password/reset-code', { email }, {
        params: { email }
    })
}

export function resetPasswordByEmail(data) {
    return service.put('/user/password/reset', data)
}
