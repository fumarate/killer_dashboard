<template>
  <van-overlay :show="shareOverlay" @click="shareOverlay = false">
    <div class="overlayWrapper">
      <img
        class="shareQRCode"
        resizemode="contain"
        src="https://pica.zhimg.com/36940066ff196785773634369b4290c8_r.jpg?source=1940ef5c"
      />
      <span style="color: white">点击任意区域退出</span>
    </div>
  </van-overlay>
  <van-cell-group inset>
    <van-field v-if="user != null" v-model="user.user_name" label="用户名">
      <template #right-icon>
        <van-tag type="primary">{{ "#" + user.user_id }}</van-tag>
      </template>
    </van-field>
    <van-swipe-cell v-if="user.account!=null">
      <van-field label="绑定账号" v-model="user.account" readonly @click="hook">
        <template #right-icon>
          <van-tag v-if="user.account_valid" type="success">有效</van-tag>
          <van-tag v-else type="danger">无效</van-tag>
        </template>
      </van-field>
      <template #right>
        <van-button
          :style="{ height: '100%' }"
          v-if="!user.account_valid"
          @click="hook"
          style="margin-left: 10px"
          >更新</van-button
        >
        <van-button v-if="user.account!=null" :style="{ height: '100%' }" type="primary" @click="unhook"
          >解除绑定</van-button
        >
        
      </template>
    </van-swipe-cell>
    <van-button v-else type="primary" width="100%" size="large" @click="hook">
      绑定账号
    </van-button>
    <van-popup :show="hooking" position="bottom" closeable @close="hooking = false">
      <account-add :user_id="user.user_id" 
      :account="user.account"
      @succeeded="hookSucceeded"
      @failed = "hookFailed"
      > </account-add>
    </van-popup>
  </van-cell-group>
  <div style="margin: 16px">
    <van-button type="primary" round size="large" @click="startSharing"
      >分享</van-button
    >
  </div>
  <van-share-sheet
    ref="shareSheet"
    v-model:show="showShare"
    title="立即分享给好友"
    :options="shareOptions"
    @select="share"
  />
  <div id="qrcode"></div>
</template>

<script>
import { showNotify, showSuccessToast, Toast } from "vant";
import { auth } from "../api/auth";
import AccountAdd from "./AccountAdd.vue";
export default {
  components: { AccountAdd },
  data() {
    return {
      hooking:false,
      showShare: false,
      shareOptions: [
        { name: "微信", icon: "wechat" },
        { name: "QQ", icon: "qq" },
        { name: "复制链接", icon: "link" },
        { name: "二维码", icon: "qrcode" },
      ],
      shareOverlay: false,
      user: {
        user_id: 28,
        user_name: "被",
        account: 18667031870,
        account_valid: true,
        point: 1304235200566206,
        vip_level: 440652530577652,
      },
    };
  },
  async mounted() {
    this.user = await auth();
  },
  methods: {
    unhook() {
      this.user.account = null;
      this.user.account_valid = false;
      console.log(this.user)
    },
    async hook() {
      this.hooking = true;
      
      //this.user = await auth();
    },
    hookSucceeded(){
      this.hooking = false;
      showNotify({message:'绑定成功！'})
    }
    ,
    hookFailed(reason){
      showNotify({message:'绑定失败！'+reason})
    },
    startSharing() {
      this.showShare = true;
    },
    share(option, index) {
      switch (index) {
        case 0:
          //wechat
          break;
        case 1:
          //qq
          break;
        case 2:
          navigator.clipboard.write(document.location);
          showSuccessToast("成功复制到剪贴板");
          break;
        case 3:
          //qrcode
          let link = document.location;
          this.shareOverlay = true;

          break;
        default:
      }
      this.showShare = false;
    },
  },
  computed: {},
};
</script>

<style>
.hint {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 50px;
}

.overlayWrapper {
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width:100%;
  padding:0%
}

.shareQRCode {
  background-color: white;
  border-radius: 10px;
  width: 50%;
}


</style>
