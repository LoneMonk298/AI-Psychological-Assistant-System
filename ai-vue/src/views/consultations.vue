<template>
  <div>
    <PageHead page-title="咨询记录" />
    <el-table :data="tableData" style="width: 100%"  >
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar :size="36">{{ getAvatarText(scope.row.userNickname) }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">
            {{ scope.row.sessionTitle }}
          </div>
          <div class="session-preview">
            {{ scope.row.lastMessageContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="100" />
      <el-table-column prop="lastMessageTime" label="时间" width="100" />
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button type="primary" text @click="viewSessionDetail(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px"
      layout="prev, pager, next"
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.size"
      :total="pagination.total"
      @current-change="handleChange"
    />
    <el-dialog
      v-model="showDetailDialog"
      title="咨询会话详情"
      :close-on-click-modal="false"
      width="50%"
    >
      <!-- 咨询会话详情内容 -->
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{ sessionDetail.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">开始时间：</div>
            <div class="detail-value">{{ sessionDetail.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">{{ sessionDetail.messageCount }}</div>
          </div>
        </div>
        <div class="messages-containter">
          <div class="messages-header">
            <h4>会话记录</h4>
          </div>
          <div class="messages-list" v-loading="loadingMessages">
            <div
              v-for="message in sessionMessages"
              :key="message.id"
              class="message-item"
              :class="message.senderType === 1 ? 'user-message' : 'ai-message'"
            >
              <div class="message-header">
                <span class="sender">{{
                  message.senderType === 1 ? "用户" : "AI助手"
                }}</span>
                <span class="time">{{ message.createdAt }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import PageHead from "@/components/PageHead.vue";
import { getConsultationPage, getSessionDetailDetail } from "@/api/admin";

const tableData = ref([]);

const pagination = reactive({
  currentPage: 1,
  total: 0,
  size: 100,
});

const sessionDetail = ref({});
const sessionMessages = ref([]);
const loadingMessages = ref(false);

const viewSessionDetail = async (row) => {
  loadingMessages.value = true;
  showDetailDialog.value = true;
  getSessionDetailDetail(row.id).then((res) => {
    loadingMessages.value = false;
    sessionMessages.value = res?.data || res || [];
    sessionDetail.value = row;
  });
};

const handleChange = (page) => {
  pagination.currentPage = page;
  handleSearch();
};

const handleSearch = async () => {
  const res = await getConsultationPage(pagination);

  const data = res?.data || res;
  tableData.value = data?.records || data || [];
  if (data?.total !== undefined) {
    pagination.total = data.total;
  }
};

// 咨询记录详情弹窗
const showDetailDialog = ref(false);

const getAvatarText = (value) => {
  const text = String(value || "?").trim();
  return text ? text.slice(0, 1).toUpperCase() : "?";
};

onMounted(() => {
  handleSearch();
});
</script>
<style scoped>
.detail-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.detail-row {
  display: flex;
  align-items: center;
}

.detail-label {
  color: #909399;
  margin-right: 6px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
}

.messages-list {
  max-height: 400px;
  overflow-y: auto;
}

.message-item {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  line-height: 1.6;
}

.user-message {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.ai-message {
  background-color: #f0f9eb;
  border-left: 3px solid #67c23a;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.sender {
  font-weight: 600;
  font-size: 13px;
}

.time {
  color: #c0c4cc;
  font-size: 12px;
}

.message-content {
  color: #606266;
}
</style>
