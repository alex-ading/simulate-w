<template>
    <div>
        <div :class="{'new-post-cover': isToastShow}">
            <navinfo>
                <img slot="left" src="../assets/back.png" alt="back" class="navinfo-left-icon" @click="clickBack">
                <span slot="right" class="btn new-post-btn" @click="clickPostNewPost">发布</span>
                <span slot="title">发布新动态</span>
            </navinfo>
            <div class="new-post-detail">
                <textarea id="input-new-post" v-model="detail"></textarea>
                <div class="new-post-img">
                    <div class="upload-img-btn-container new-post-img-item" ref="upload">
                        <input type="file" id="upload-img-btn" accept="image/*" @change="uploadImg" multiple>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isToastShow" class="new-post-ing">
            <span class="new-post-toast">{{toastText}}</span>           
        </div>
    </div>

</template>

<script>
import axios from 'axios'
import * as tcb from 'tcb-js-sdk';

import Navinfo from '../components/Navinfo'

export default {
    name: "NewPost",
    data() {
        return {
            detail: null,
            toastText: "正在发送",
            isToastShow: false,
            filelist: []
        }
    },
    methods: {
        clickBack() {
            this.$router.go(-1)
        },
        async clickPostNewPost() {
            if (!this.detail) {
                this.isToastShow = true;
                this.toastText = "内容不能为空";
                setTimeout(() => {
                    this.isToastShow = false;
                }, 1000)
                return false
            }

            let reg = /<script>.*<\/script>/
            let isValid = reg.test(this.detail);
            if (isValid) {
                this.isToastShow = true;
                this.toastText = "含有不合法内容";  
                setTimeout(() => {
                    this.isToastShow = false;
                }, 1000)              
                return false
            } 
            // 调整前端 css
            this.toastText = "正在发送";
            this.isToastShow = true;

            const app = tcb.init({
            env: 'cloud-4gm4rigo8c5f1c23'
            });
            // 访问云存储之前要先登录
            // 匿名登陆 调用腾讯云api
            const auth = app.auth();
            // console.log(auth)

            // async function login(){
            await auth.signInAnonymously();
                // 匿名登录成功检测登录状态isAnonymous字段为true
            const loginState = await auth.getLoginState();
            // console.log(loginState.isAnonymousAuth); // true
            // }
            // login();

            // 上传图片 
            let userid = this.$store.state.userid;
            let detail = this.detail;

            if (this.filelist.length > 0) {
                let url = await this.uploadImgtoCloud(this.filelist, app);
                // console.log(url)
                url = JSON.stringify(url)
                axios({
                    method: "post",
                    url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/new_post",
                    data: {
                        userid: userid,
                        detail: detail,
                        url: url
                    }
                }).then(res => {
                    // console.log(res.data);
                    this.toastText = "发送成功"
                    this.$store.commit("updateisNewPost");
                    setTimeout(() => {
                        this.isToastShow = false;
                        this.$router.push('/')
                    }, 1500)
                }).catch(err => {
                    console.log(err);
                    this.toastText = "暂时没有权限";
                    setTimeout(() => {
                        this.isToastShow = false
                    }, 2000)
                })
            } else {
                // console.log("no pic")
                axios({
                    method: "post",
                    url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/new_post",
                    data: {
                        userid: userid,
                        detail: detail,
                    }
                }).then(res => {
                    // console.log(res.data);
                    this.toastText = "发送成功"
                    this.$store.commit("updateisNewPost");
                    setTimeout(() => {
                        this.isToastShow = false;
                        this.$router.push('/')
                    }, 1500)
                }).catch(err => {
                    console.log(err)
                    this.toastText = "暂时没有权限";
                    setTimeout(() => {
                        this.isToastShow = false
                    }, 2000)
                })
            }
        },

        async uploadImgtoCloud(filelist, app) {
            let resList = [];
            for (let item of filelist) {
                for (let file of item) {
                    await app
                    .uploadFile({
                        // 云端路径
                        cloudPath: "img/" + file.name,
                        // 需要上传的文件，File 类型
                        filePath: file,
                    })
                    .then(async (res) => {
                        // 返回文件 ID
                        // console.log("上传云端成功")
                        // console.log(res.fileID);
                        let fileID = res.fileID;

                        await app
                        .getTempFileURL({
                            fileList: [fileID]
                        })
                        .then((res) => {
                            // console.log("获取url成功");
                            resList.push(res.fileList[0].tempFileURL)
                        });
                    });
                }
                
            }
            // console.log(resList)
            return resList
        },

        uploadImg(event) {
            window.URL = window.URL || window.webkitURL;
            let container = document.getElementsByClassName("new-post-img")[0];
            let inputEle = event.target;
            let files = event.target.files;
            let total = document.getElementsByClassName("new-post-img-item").length - 1 + files.length;
            if (total === 9) {
                let upload = this.$refs.upload;
                upload.remove();
            }
            if (total > 9) {
                alert("不能超过 9 张");
                return false
            }
            this.filelist.push(files);
            // console.log(this.filelist);
            for (let file of files) {
                let img = document.createElement("img");
                img.src = window.URL.createObjectURL(file);
                img.onload = function() {
                    window.URL.revokeObjectURL(this.src);
                    // console.log("释放")
                }
                let div = document.createElement("div");
                div.setAttribute("class", "new-post-img-item");
                div.appendChild(img);
                container.appendChild(div);
            }
        },       
    },
    components: {
        Navinfo
    }

}
</script>

<style lang="less">
    .navinfo-left-icon {
        position: absolute;
        left: 0.625em;
        width: 1.5em;
        height: 1.5em;
        margin-top: 0.59375em;
    }
    
    .new-post-cover {
        opacity: 0.3;
    }
    .new-post-ing {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .new-post-toast {
        position: absolute;
        bottom: 5em;
        left: 50%;
        transform: translateX(-50%);
        font-weight: 500;
        padding: 0.5em;
        // color: #2c3e50;
        color: white;
        background-color:  #b0cac7;
        border-radius: 0.625em;
    }

    .btn {
        background-color: #b0cac7;
        color: white;
    }
    
    .new-post-btn {
        position: absolute;
        right: 0.625em;
        margin-top: 0.575em;
        border-radius: 0.7em;
        padding: 0.1em 0.4em;
    }


    .new-post-detail {
        font-size: 1.6rem;
        // border: 1px solid black;
        height: calc(100% - 2.75em);
        overflow-x: hidden;
        overflow-y: scroll;
        textarea  {
            font-size: 2rem;
            width: 100%;
            min-height: 20em;
            padding: 0.675em;
            border: 0;
        }

        .new-post-img {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            border-top: 0.0625em solid #bfbfbf;
            padding: 0.675em;
            // border: 1px solid black;
            .new-post-img-item {
                flex: 0 1 33%;
                height: 8em;
                margin-bottom: calc(1% / 3);
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .new-post-img-item:not(:nth-child(3n)) {
                margin-right: calc(1% / 3);
            }

            .upload-img-btn-container {
                background-image: url("../assets/uploadimg.png");     
                background-repeat: no-repeat; 
                // border: 0.0625em solid #bfbfbf;
                background-position: 50% 50%;
                order: 99;
                #upload-img-btn {
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    // background-color: indianred;
                }
            }
        }
    }



</style>