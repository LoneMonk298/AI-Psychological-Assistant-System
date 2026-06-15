package com.example.aiserver.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.aiserver.common.ApiResult;
import com.example.aiserver.entity.EmotionDiary;
import com.example.aiserver.entity.KnowledgeArticle;
import com.example.aiserver.entity.PsychologicalChatSession;
import com.example.aiserver.entity.SysUser;
import com.example.aiserver.mapper.EmotionDiaryMapper;
import com.example.aiserver.mapper.KnowledgeArticleMapper;
import com.example.aiserver.mapper.PsychologicalChatSessionMapper;
import com.example.aiserver.mapper.SysUserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/data-analytics")
public class DataAnalyticsController {
    private final SysUserMapper userMapper;
    private final EmotionDiaryMapper emotionDiaryMapper;
    private final PsychologicalChatSessionMapper chatSessionMapper;
    private final KnowledgeArticleMapper articleMapper;

    @GetMapping("/overview")
    public ApiResult<Map<String, Object>> overview() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("systemOverview", systemOverview());
        data.put("consultationStats", chatStatsData());
        data.put("emotionTrend", emotionTrendData());
        data.put("consultationTrend", consultationTrendData());
        data.put("knowledgeStats", knowledgeStatsData());
        return ApiResult.success(data);
    }

    @GetMapping("/emotion-trend")
    public ApiResult<List<Map<String, Object>>> emotionTrend() {
        return ApiResult.success(emotionTrendData());
    }

    @GetMapping("/chat-stats")
    public ApiResult<Map<String, Object>> chatStats() {
        return ApiResult.success(chatStatsData());
    }

    @GetMapping("/knowledge-stats")
    public ApiResult<Map<String, Object>> knowledgeStats() {
        return ApiResult.success(knowledgeStatsData());
    }

    private Map<String, Object> systemOverview() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        Long totalUsers = userMapper.selectCount(new LambdaQueryWrapper<SysUser>());
        Long activeUsers = userMapper.selectCount(new LambdaQueryWrapper<SysUser>().eq(SysUser::getStatus, 1));
        Long totalDiaries = emotionDiaryMapper.selectCount(new LambdaQueryWrapper<EmotionDiary>());
        Long todayNewDiaries = emotionDiaryMapper.selectCount(new LambdaQueryWrapper<EmotionDiary>()
                .ge(EmotionDiary::getCreatedAt, todayStart));
        Long totalSessions = chatSessionMapper.selectCount(new LambdaQueryWrapper<PsychologicalChatSession>());
        Long todayNewSessions = chatSessionMapper.selectCount(new LambdaQueryWrapper<PsychologicalChatSession>()
                .ge(PsychologicalChatSession::getCreatedAt, todayStart));

        List<EmotionDiary> diaries = emotionDiaryMapper.selectList(new LambdaQueryWrapper<EmotionDiary>());
        double avgMoodScore = diaries.stream()
                .filter(item -> item.getMoodScore() != null)
                .mapToInt(EmotionDiary::getMoodScore)
                .average()
                .orElse(0);

        Map<String, Object> overview = new LinkedHashMap<>();
        overview.put("totalUsers", totalUsers);
        overview.put("activeUsers", activeUsers);
        overview.put("totalDiaries", totalDiaries);
        overview.put("todayNewDiaries", todayNewDiaries);
        overview.put("totalSessions", totalSessions);
        overview.put("todayNewSessions", todayNewSessions);
        overview.put("avgMoodScore", Math.round(avgMoodScore * 10.0) / 10.0);
        overview.put("recordCount", totalDiaries);
        return overview;
    }

    private List<Map<String, Object>> emotionTrendData() {
        LocalDate start = LocalDate.now().minusDays(6);
        List<EmotionDiary> diaries = emotionDiaryMapper.selectList(new LambdaQueryWrapper<EmotionDiary>()
                .ge(EmotionDiary::getDiaryDate, start)
                .orderByAsc(EmotionDiary::getDiaryDate));
        Map<LocalDate, List<EmotionDiary>> grouped = diaries.stream()
                .filter(item -> item.getDiaryDate() != null)
                .collect(Collectors.groupingBy(EmotionDiary::getDiaryDate));

        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = start.plusDays(i);
            List<EmotionDiary> items = grouped.getOrDefault(date, List.of());
            double avg = items.stream()
                    .filter(item -> item.getMoodScore() != null)
                    .mapToInt(EmotionDiary::getMoodScore)
                    .average()
                    .orElse(0);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("date", date.toString());
            row.put("avgMoodScore", Math.round(avg * 10.0) / 10.0);
            row.put("moodScore", Math.round(avg * 10.0) / 10.0);
            row.put("recordCount", items.size());
            row.put("count", items.size());
            trend.add(row);
        }
        return trend;
    }

    private Map<String, Object> chatStatsData() {
        Long totalSessions = chatSessionMapper.selectCount(new LambdaQueryWrapper<PsychologicalChatSession>());
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalSessions", totalSessions);
        stats.put("avgDurationMinutes", 0);
        return stats;
    }

    private List<Map<String, Object>> consultationTrendData() {
        LocalDate start = LocalDate.now().minusDays(6);
        List<PsychologicalChatSession> sessions = chatSessionMapper.selectList(new LambdaQueryWrapper<PsychologicalChatSession>()
                .ge(PsychologicalChatSession::getCreatedAt, start.atStartOfDay())
                .orderByAsc(PsychologicalChatSession::getCreatedAt));
        Map<LocalDate, Long> grouped = sessions.stream()
                .filter(item -> item.getCreatedAt() != null)
                .collect(Collectors.groupingBy(item -> item.getCreatedAt().toLocalDate(), Collectors.counting()));

        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = start.plusDays(i);
            Long count = grouped.getOrDefault(date, 0L);
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("date", date.toString());
            row.put("sessionCount", count);
            row.put("recordCount", count);
            row.put("count", count);
            trend.add(row);
        }
        return trend;
    }

    private Map<String, Object> knowledgeStatsData() {
        Long totalArticles = articleMapper.selectCount(new LambdaQueryWrapper<KnowledgeArticle>());
        Long publishedArticles = articleMapper.selectCount(new LambdaQueryWrapper<KnowledgeArticle>()
                .eq(KnowledgeArticle::getStatus, 1));
        List<KnowledgeArticle> articles = articleMapper.selectList(new LambdaQueryWrapper<KnowledgeArticle>());
        long totalReadCount = articles.stream()
                .filter(item -> item.getReadCount() != null)
                .mapToLong(KnowledgeArticle::getReadCount)
                .sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalArticles", totalArticles);
        stats.put("publishedArticles", publishedArticles);
        stats.put("totalReadCount", totalReadCount);
        return stats;
    }
}
