<<<<<<< Updated upstream
export const addEmotionDiary = (data) => {
    return Service.post("/emotion-diary", data);
=======
import service from "@/utils/request";

export const addEmotionDiary = (data) => {
    return service.post("/emotion-diary", data);
}

export function getKnowledgeList(params) {
    return service.get('/knowledge/article/page', {params})
>>>>>>> Stashed changes
}