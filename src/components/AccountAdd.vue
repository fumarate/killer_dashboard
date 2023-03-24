<template>
    <van-form @submit="hook">
  <van-cell-group>
      <van-field

        v-model="account"
        label="手机号码"
        maxlength="11"
        :rules="[
          {
            required: true,
            message: '请填写手机号',
          },
          {
            pattern:
              /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\d{8}$/,
            message: '手机号格式不正确',
          },
        ]"
    />
  
      <van-field
        v-model="captcha"
        label="验证码"
        maxlength="4"
        :rules="[
          { required: true, message: '请填写验证码' },
          {
            validator: (val) => String(val).length == 4,
            message: '验证码有误',
          },
        ]"
      >
        <template #button>
          <van-button type="primary" @click="requestCaptcha" size="small"
            >发送验证码</van-button
          >
        </template>
      </van-field>
 
       <div style="margin: 16px;">
    <van-button round block type="primary" native-type="submit">
        {{
        update ? "更新" : "添加"
      }}
    </van-button>
  </div>
  </van-cell-group>
</van-form>
</template>

<script>
export default {
    props:['user_id','account'],
    emits:['succeeded','failed'],
    data(){
return {
    user_id:this.user_id,
    captcha:'',
    account:this.account
}
    },
  methods: {
    retquestCaptcha() {
      console.log("requestCaptcha");
    },
    hook(){
        let result = false;
        let failedReason = "账户不存在"
        if(result){
            this.$emit('succeeded');
        }else{
            this.$emit('failed',failedReason);
        }
    }
  },
};
</script>

<style>
</style>