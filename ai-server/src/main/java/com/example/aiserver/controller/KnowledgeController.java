package com.example.aiserver.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.aiserver.common.ApiResult;
import com.example.aiserver.dto.ArticleStatusRequest;
import com.example.aiserver.entity.KnowledgeArticle;
import com.example.aiserver.entity.KnowledgeCategory;
import com.example.aiserver.mapper.KnowledgeArticleMapper;
import com.example.aiserver.mapper.KnowledgeCategoryMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/knowledge")
public class KnowledgeController {
    private final KnowledgeCategoryMapper categoryMapper;
    private final KnowledgeArticleMapper articleMapper;

    @GetMapping("/category/tree")
    public ApiResult<List<Map<String, Object>>> categoryTree() {
        List<KnowledgeCategory> categories = categoryMapper.selectList(new LambdaQueryWrapper<KnowledgeCategory>()
                .eq(KnowledgeCategory::getStatus, 1)
                .orderByAsc(KnowledgeCategory::getParentId)
                .orderByAsc(KnowledgeCategory::getSortOrder));
        return ApiResult.success(categories.stream().map(this::toCategoryMap).collect(Collectors.toList()));
    }

    @GetMapping("/article/page")
    public ApiResult<Page<KnowledgeArticle>> articlePage(
            @RequestParam(defaultValue = "1") long currentPage,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String sortField,
            @RequestParam(required = false) String sortDirection
    ) {
        LambdaQueryWrapper<KnowledgeArticle> wrapper = new LambdaQueryWrapper<KnowledgeArticle>()
                .like(StringUtils.hasText(title), KnowledgeArticle::getTitle, title)
                .eq(categoryId != null, KnowledgeArticle::getCategoryId, categoryId)
                .eq(status != null, KnowledgeArticle::getStatus, status);
        if ("readCount".equals(sortField)) {
            wrapper.orderBy(true, "asc".equalsIgnoreCase(sortDirection), KnowledgeArticle::getReadCount);
        } else if ("publishedAt".equals(sortField)) {
            wrapper.orderBy(true, "asc".equalsIgnoreCase(sortDirection), KnowledgeArticle::getPublishedAt);
        } else {
            wrapper.orderByDesc(KnowledgeArticle::getUpdatedAt);
        }

        Page<KnowledgeArticle> page = articleMapper.selectPage(new Page<>(currentPage, size), wrapper);
        return ApiResult.success(page);
    }

    @PostMapping("/article")
    public ApiResult<KnowledgeArticle> addArticle(@RequestBody KnowledgeArticle article) {
        if (!StringUtils.hasText(article.getAuthorName())) {
            article.setAuthorId(1L);
            article.setAuthorName("System Administrator");
        }
        if (article.getStatus() == null) {
            article.setStatus(0);
        }
        if (article.getReadCount() == null) {
            article.setReadCount(0);
        }
        articleMapper.insert(article);
        return ApiResult.success(article);
    }

    @GetMapping("/article/{id}")
    public ApiResult<KnowledgeArticle> articleDetail(@PathVariable Long id) {
        return ApiResult.success(articleMapper.selectById(id));
    }

    @PutMapping("/article/{id}")
    public ApiResult<KnowledgeArticle> updateArticle(@PathVariable Long id, @RequestBody KnowledgeArticle article) {
        article.setId(id);
        article.setUpdatedAt(LocalDateTime.now());
        articleMapper.updateById(article);
        return ApiResult.success(articleMapper.selectById(id));
    }

    @PutMapping("/article/{id}/status")
    public ApiResult<Void> changeStatus(@PathVariable Long id, @Valid @RequestBody ArticleStatusRequest request) {
        KnowledgeArticle article = new KnowledgeArticle();
        article.setId(id);
        article.setStatus(request.getStatus());
        if (request.getStatus() == 1) {
            article.setPublishedAt(LocalDateTime.now());
        }
        articleMapper.updateById(article);
        return ApiResult.success();
    }

    @DeleteMapping("/article/{id}")
    public ApiResult<Void> deleteArticle(@PathVariable Long id) {
        articleMapper.deleteById(id);
        return ApiResult.success();
    }

    private Map<String, Object> toCategoryMap(KnowledgeCategory category) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", category.getId());
        data.put("parentId", category.getParentId());
        data.put("name", category.getName());
        data.put("categoryName", category.getName());
        data.put("code", category.getCode());
        data.put("description", category.getDescription());
        data.put("sortOrder", category.getSortOrder());
        data.put("status", category.getStatus());
        data.put("createdAt", category.getCreatedAt());
        data.put("updatedAt", category.getUpdatedAt());
        data.put("deleted", category.getDeleted());
        return data;
    }
}
