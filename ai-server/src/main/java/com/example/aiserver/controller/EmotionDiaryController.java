package com.example.aiserver.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.aiserver.common.ApiResult;
import com.example.aiserver.dto.EmotionDiaryRequest;
import com.example.aiserver.entity.EmotionDiary;
import com.example.aiserver.entity.SysUser;
import com.example.aiserver.mapper.EmotionDiaryMapper;
import com.example.aiserver.util.CurrentUserUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/emotion-diary")
public class EmotionDiaryController {
    private final EmotionDiaryMapper emotionDiaryMapper;
    private final CurrentUserUtil currentUserUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    public ApiResult<Map<String, Object>> add(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody EmotionDiaryRequest request
    ) throws JsonProcessingException {
        SysUser user = currentUserUtil.requireUser(authorization);
        Map<String, Object> analysis = buildAnalysis(request);

        EmotionDiary diary = new EmotionDiary();
        diary.setUserId(user.getId());
        diary.setUsername(user.getUsername());
        diary.setNickname(user.getNickname());
        diary.setDiaryDate(request.getDiaryDate() == null ? LocalDate.now() : request.getDiaryDate());
        diary.setMoodScore(request.getMoodScore());
        diary.setDominantEmotion(request.getDominantEmotion());
        diary.setSleepQuality(request.getSleepQuality());
        diary.setStressLevel(request.getStressLevel());
        diary.setEmotionTriggers(request.getEmotionTriggers());
        diary.setDiaryContent(request.getDiaryContent());
        diary.setAiEmotionAnalysis(objectMapper.writeValueAsString(analysis));
        emotionDiaryMapper.insert(diary);

        return ApiResult.success(toDiaryMap(diary));
    }

    @GetMapping("/admin/page")
    public ApiResult<Map<String, Object>> adminPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer moodScore
    ) {
        Page<EmotionDiary> page = emotionDiaryMapper.selectPage(
                new Page<>(current, size),
                new LambdaQueryWrapper<EmotionDiary>()
                        .eq(userId != null, EmotionDiary::getUserId, userId)
                        .eq(moodScore != null, EmotionDiary::getMoodScore, moodScore)
                        .orderByDesc(EmotionDiary::getCreatedAt)
        );

        List<Map<String, Object>> records = new ArrayList<>();
        for (EmotionDiary diary : page.getRecords()) {
            records.add(toDiaryMap(diary));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("records", records);
        result.put("total", page.getTotal());
        result.put("size", page.getSize());
        result.put("current", page.getCurrent());
        result.put("pages", page.getPages());
        return ApiResult.success(result);
    }

    @DeleteMapping("/admin/{id}")
    public ApiResult<Void> delete(@PathVariable Long id) {
        emotionDiaryMapper.deleteById(id);
        return ApiResult.success();
    }

    private Map<String, Object> buildAnalysis(EmotionDiaryRequest request) {
        int score = request.getMoodScore() == null ? 5 : request.getMoodScore();
        int stress = request.getStressLevel() == null ? 3 : request.getStressLevel();
        String emotion = request.getDominantEmotion() == null || request.getDominantEmotion().isBlank()
                ? "平静"
                : request.getDominantEmotion();
        boolean negative = score <= 4 || stress >= 4;
        String riskLevel = score <= 3 || stress >= 5 ? "高" : (score <= 5 || stress >= 4 ? "中" : "低");
        int intensity = Math.min(100, Math.max(10, negative ? (100 - score * 8 + stress * 6) : score * 8));

        List<String> improvements = new ArrayList<>();
        improvements.add("记录触发情绪的具体事件，并拆分可行动的小步骤。");
        improvements.add("安排 10 分钟呼吸或放松练习，降低身体紧绷感。");
        if (stress >= 4) {
            improvements.add("优先减少当天非必要任务，给自己留出恢复时间。");
        }

        Map<String, Object> analysis = new LinkedHashMap<>();
        analysis.put("mainEmotion", emotion);
        analysis.put("primaryEmotion", emotion);
        analysis.put("intensity", intensity);
        analysis.put("emotionScore", intensity);
        analysis.put("riskLevel", riskLevel);
        analysis.put("sentiment", negative ? "negative" : "positive");
        analysis.put("isNegative", negative);
        analysis.put("analysisResult", "根据情绪评分、压力水平和主要情绪生成的规则分析。");
        analysis.put("suggestion", negative ? "建议先降低任务压力，保持规律作息，并在情绪持续低落时寻求支持。" : "当前状态较稳定，可以继续保持记录和复盘。");
        analysis.put("riskDescription", "高".equals(riskLevel) ? "当前压力或低落程度较高，建议重点关注。" : "当前风险等级为" + riskLevel + "。");
        analysis.put("improvementSuggestions", improvements);
        return analysis;
    }

    private Map<String, Object> toDiaryMap(EmotionDiary diary) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", diary.getId());
        data.put("userId", diary.getUserId());
        data.put("userid", diary.getUserId());
        data.put("username", diary.getUsername());
        data.put("nickname", diary.getNickname());
        data.put("diaryDate", diary.getDiaryDate());
        data.put("moodScore", diary.getMoodScore());
        data.put("dominantEmotion", diary.getDominantEmotion());
        data.put("sleepQuality", diary.getSleepQuality());
        data.put("stressLevel", diary.getStressLevel());
        data.put("emotionTriggers", diary.getEmotionTriggers());
        data.put("diaryContent", diary.getDiaryContent());
        data.put("aiEmotionAnalysis", diary.getAiEmotionAnalysis());
        data.put("createdAt", diary.getCreatedAt());
        data.put("updatedAt", diary.getUpdatedAt());

        Map<String, Object> analysis = parseAnalysis(diary.getAiEmotionAnalysis());
        data.putAll(analysis);
        data.putIfAbsent("mainEmotion", diary.getDominantEmotion());
        data.putIfAbsent("intensity", diary.getMoodScore() == null ? 0 : diary.getMoodScore() * 10);
        data.putIfAbsent("riskLevel", "低");
        data.putIfAbsent("sentiment", "neutral");
        data.putIfAbsent("analysisResult", "");
        data.putIfAbsent("suggestion", "");
        data.putIfAbsent("riskDescription", "");
        data.putIfAbsent("improvementSuggestions", List.of());
        return data;
    }

    private Map<String, Object> parseAnalysis(String json) {
        if (json == null || json.isBlank()) {
            return new LinkedHashMap<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception ignored) {
            return new LinkedHashMap<>();
        }
    }
}
