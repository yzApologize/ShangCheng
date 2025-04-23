<template>
  <div class="dialogContainer">
    <el-dialog v-model="flag" width="500px" @open="open" @close="close">
      <template #header>
        <span>{{ props.title }}</span>
      </template>
      <el-form
        :model="form"
        style="margin-top: 20px; width: 80%"
        ref="formIstance"
        :rules="rules"
        label-width="105px">
        <el-form-item label="品牌名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO：" prop="logo">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="flag = false">取消</el-button>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { addOrUpdateTradeMarkAPI } from '@/api/product';

const flag = ref(false);
const formIstance = ref();
const form = reactive({
  name: '',
  logoUrl: ''
});
const logoValidator = (rule: any, value: any, callback: any) => {
  if (form.logoUrl == '') {
    callback(new Error('请上传品牌logo'));
  } else {
    callback();
  }
};
const rules = ref({
  name: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],
  logo: [{ required: true, validator: logoValidator }]
});

const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  },
  title: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['refresh']);
defineExpose({
  openDialog() {
    flag.value = true;
  }
});
// 上传图片钩子函数，在上传成功之前触发
const beforeAvatarUpload = (file: any) => {
  const isTpye =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
  const isLt4M = file.size / 1024 / 1024 < 4;
  if (!isTpye) {
    ElMessage.error('上传图片格式不符合!');
    return false;
  } else if (!isLt4M) {
    ElMessage.error('上传图片大小不能超过 4MB!');
    return false;
  } else {
    return true;
  }
};
// 上传图片钩子函数，在上传成功之后触发
const handleAvatarSuccess = (response: any, upload) => {
  //response 为上传成功后返回的数据,upload为上传的文件
  // 上传成功后，将图片的地址赋值给imageUrl
  if (response.code == 200) {
    form.logoUrl = response.data;
    //清除校验
    formIstance.value.clearValidate('logo');
  } else {
    ElMessage.error('上传图片失败!');
  }
};
const open = () => {
  if (props.title == '编辑品牌') {
    //反显
    console.log('编辑品牌id:', props.row);
    form.name = props.row.tmName;
    form.logoUrl = props.row.logoUrl;
  }
};
const close = () => {
  //清空表单
  form.name = '';
  form.logoUrl = '';
  //清空校验
  formIstance.value.clearValidate();
};

const submitForm = async () => {
  const res = await formIstance.value.validate();
  if (!res) {
    return;
  }
  if (props.title == '添加品牌') {
    console.log('添加品牌');
    try {
      let data = {
        tmName: form.name,
        logoUrl: form.logoUrl
      };
      await addOrUpdateTradeMarkAPI(data);
      ElMessage.success('添加品牌成功');
      emit('refresh');
      flag.value = false;
      formIstance.value.resetFields();
    } catch {
      ElMessage.error('添加品牌失败');
    }
  } else {
    console.log('编辑品牌');
    try {
      let data = {
        id: props.row.id,
        tmName: form.name,
        logoUrl: form.logoUrl
      };
      await addOrUpdateTradeMarkAPI(data);
      ElMessage.success('编辑品牌成功');
      emit('refresh');
      flag.value = false;
    } catch {
      ElMessage.error('编辑品牌失败');
    }
  }
};
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 0;
    display: flex;
    justify-content: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
}
</style>
