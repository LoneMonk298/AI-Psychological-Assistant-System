import service from "@/utils/request";

export const addEmotionDiary = (data) => {
    return service.post("/emotion-diary", data);
}

export function getKnowledgeList(params) {
    return service.get('/knowledge/article/page', {params})
}

export function getKnowledgeCategoryTree() {
    return service.get('/knowledge/category/tree')
}

export function getKnowledgeDetail(articleId) {
    return service.get(`/knowledge/article/${articleId}`)
}

export function getUserProfile() {
    return service.get('/user/profile')
}

export function updateUserProfile(data) {
    return service.put('/user/profile', data)
}

export function updateUserPassword(data) {
    return service.put('/user/password', data)
}

export function updateUserEmail(data) {
    return service.put('/user/email', data)
}

export function uploadUserAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'avatar')
    return service.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}
