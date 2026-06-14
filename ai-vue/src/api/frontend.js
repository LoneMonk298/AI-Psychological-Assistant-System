import service from "@/utils/request";

export function getKnowledgeList(params) {
    return service.get('/knowledge/article/page', {params})
}

export function getKnowledgeDetail(articleId) {
    return service.get(`/knowledge/article/${articleId}`)
}