package com.example.aiserver.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EmotionDiaryRequest {
    private LocalDate diaryDate;
    @NotNull
    @Min(1)
    @Max(10)
    private Integer moodScore;
    private String dominantEmotion;
    private Integer sleepQuality;
    private Integer stressLevel;
    private String emotionTriggers;
    private String diaryContent;
}
