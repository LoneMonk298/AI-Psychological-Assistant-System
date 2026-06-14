import service from "@/utils/request";

export const addEmotionDiary = (data) => {
    return service.post("/emotion-diary", data);
}

export function getKnowledgeList(params) {
    return service.get('/knowledge/article/page', {params})
}