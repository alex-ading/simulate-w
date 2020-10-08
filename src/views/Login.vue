<template>
    <div>
        <div class="login">
            <navinfo>
                <p slot="title">登录</p>
            </navinfo>

            <div class="input-login">
                <div class="login-account">
                    <span>账号</span>
                    <input type="text" v-model="userid" placeholder="测试账号：1">
                </div>
                <div class="login-password">
                    <span>密码</span>
                    <input type="password" v-model="password" placeholder="测试密码：1">
                </div>
                <button class="login-btn" @click="clickLogin">登录</button>
            </div>
        </div>
    </div>
</template>

<script>
import Navinfo from '../components/Navinfo'
export default {
    data() {
        return {
            userid: null,
            password: null
        }
    },
    components: {
        Navinfo
    },
    methods: {
        clickLogin() {
            if (this.userid === null || this.password === null) {
                alert("输入不能为空~")
                return false
            } else {
                if (this.userid === this.password) {
                    // console.log("登录成功")
                    
                    // 改变 vuex 中 userid 的值
                    this.$store.commit("login", Number(this.userid))

                    // 跳转 timeline
                    this.$router.push('/')

                } else {
                    alert("输入有误，请重新输入")
                }
            }
        }
    },

}
</script>

<style lang="less">
    .input-login {
        font-size: 1.8rem;
        margin: 10em 3em 0 3em;
        text-align: right;


        .login-account, .login-password {
            // border: 1px solid black;
            display: flex;
            justify-content: center;
            height: 2em;
            margin-bottom: 1em;
            line-height: 2em;
            span {
                flex: 0 0 auto;
                margin-right: 0.625em;
            }

            input {
                font-size: 1.6rem;
                flex: 1 0 auto;
                border-radius: 0.3125em;
                padding-left: 0.625em;

            }
        }

        .login-btn {
            height: 1.8em;
            padding: 0 0.2em;

        }
    }
</style>