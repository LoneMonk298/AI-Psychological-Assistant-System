export const addEmotionDiary = (data) => {
    return Service.post("/emotion-diary", data);
}