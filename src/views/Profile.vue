<template>
    <div class="profile" ref="profile">
        <div v-if="$store.state.profileData!==null" class="profile-info-container">
            <img class="profile-bg" :src="$store.state.profileData.info[0].headportrait" alt="">
            <div class="profile-info">
                <div class="profile-user-info">
                    <img class="profile-head-portrait profile-user-info-item" :src="$store.state.profileData.info[0].headportrait">
                    <div class="profile-user-info-item">
                        <p class="profile-user-name">{{$store.state.profileData.info[0].username}}</p>
                        <p class="profile-intro">{{$store.state.profileData.info[0].intro}}</p>
                    </div>
                </div>

                <div class="profile-data">
                    <div class="profile-post-num">
                        <p>微博</p>
                        <p>{{$store.state.profileData.ops.length}}</p>
                    </div>
                    <div class="profile-following"  @click="clickRoutetoFollowings">
                        <p>关注</p>
                        <p>{{$store.state.profileData.followings.length}}</p>
                    </div>
                    <div class="profile-follower" @click="clickRoutetoFollowers">
                        <p>被关注</p>
                        <p>{{$store.state.profileData.followers.length}}</p>
                    </div>
                </div>

                <span v-if="Follow" class="follow-btn btn" @click="clickFollow">{{Follow}}</span>
            </div>
        </div>

        <div v-if="$store.state.profileData">
            <original-post v-for="(item, index) in $store.state.profileData.ops" 
                                :key="index"
                                :itemInfo="item"
                                @click.native="clickRoutetoPostDetail(item)"
                                @cancelLike="cancelLike" @addLike="addLike"
                                >
                <div v-if="item.img" slot="post-img" :class="{'post-img-one': item.img.length === 1,
                                                                    'post-img-more': item.img.length !== 1}">
                    <img v-for="(img, imgindex) in item.img" :preview="index" :src="img" :key="imgindex" alt="">
                </div>
            </original-post>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Navinfo from '../components/Navinfo'
import OriginalPost from '../components/OriginalPost'

export default {
    name: "Profile",
    data() {
        return {
            profileid: null, // 当前profile页面id
            userid: null,
            isFollowed: null,
        }
    },

    computed: {
        Follow() {
            if(this.$store.state.profileData) {
                if (this.$store.state.profileData.info[0].userid === this.$store.state.userid) {
                    return false
                }

                for (let i of this.$store.state.profileData.followers) {
                    if (i.userid === this.$store.state.userid) {
                        this.isFollowed = true;
                console.log(this.isFollowed)

                        return "已关注"
                    }
                }
                this.isFollowed = false;
                return "关注"
            } 
            return false
        }
    },

    methods: {
        clickRoutetoPostDetail(item) {
            if (event.target.nodeName !== "IMG") {
                console.log("跳转详情页" + event.currentTarget.nodeName)
                console.log("originalpostid: " + item.originalpostid)
                this.$router.push({
                    name: "OriginalPostDetail",
                    query: {
                        userid: item.userid,
                        originalpostid: item.originalpostid
                    }
                })
            } else {
                console.log("阻止冒泡" + event.target.nodeName)
            }
        },

        cancelLike(originalpostid) {
            console.log("pf父 cancelLike");

            // 更改 profile 数据
            this.$store.dispatch("cancelLikeProfile", originalpostid);
            // 更改 tl 数据
            this.$store.commit("cancelLike", originalpostid);

        },

        addLike(originalpostid) {
            console.log("pf父 addLike")
            let day = new Date();
            let time = day.getTime();
            this.$store.dispatch("addLikeProfile", {originalpostid: originalpostid, time: time});
            this.$store.commit("addLike", {originalpostid: originalpostid, time: time});
        },

        debounce(fn, interval) {
            let timer = null;
            return function() {
                if (timer) {
                    clearTimeout(timer)
                    timer = setTimeout(fn, interval);
                } else {
                    timer = setTimeout(fn, interval);
                }
            }
        },
        
        clickRoutetoFollowings() {
            this.$router.push({
                name: "Followings",
                query: {
                    profileid: this.profileid
                }
            })
        },
        
        clickRoutetoFollowers() {
            this.$router.push({
                name: "Followers",
                query: {
                    profileid: this.profileid
                }
            })
        },

        clickFollow() {
            //改变数据库
            axios({
                method: "get",
                url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_follow",
                params: {
                    profileid: this.profileid,
                    userid: this.$store.state.userid,
                    isFollowed: this.isFollowed
                }
            }).then(res => {
                console.log(res.data)
            }).catch(err => {
                console.log(err)
            })
            console.log(this.isFollowed)

            // 改变vuex
            if (!this.isFollowed) {
                this.$store.commit("addFollower");
            } else {
                this.$store.commit("cancelFollower");
            }

        }
    },

    components: {
        Navinfo,
        OriginalPost
    },

    created() {
        console.log('profile created');
        this.profileid = this.$route.query.profileid;
        this.userid = this.$store.state.userid;
        // console.log(this.profileid);
        this.$store.dispatch("requestProfileData", this.profileid);
    },

    mounted() {
        let profile = this.$refs.profile;
        let profileDebounce = this.debounce(() => {
            this.$store.commit("updateProfilescrollTop", profile.scrollTop)
        }, 200)
        profile.addEventListener("scroll", profileDebounce, false);
    },

    activated() {
        console.log('profile activated');
        console.log(this.$route.query.profileid, this.profileid)

        if (this.$route.query.profileid === this.profileid) {
            if (this.$store.state.profilescrollTop) {
                let profile = this.$refs.profile;
                profile.scrollTop = this.$store.state.profilescrollTop;
            }
        } else {
            this.profileid = this.$route.query.profileid;
            this.$store.commit("updateProfileData", null)
            this.$store.dispatch("requestProfileData", this.profileid)
        }
    },
}
</script>

<style lang="less">
    .profile {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .profile-info-container {
        position: relative;
        width: 100%;
        height: 9.4375em;

        .profile-bg {
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: opacity(0.2);
        }

        .profile-info {
            position: absolute;
            top: 0;
            width: 100%;
            // border: 1px solid black;

            .profile-user-info {
                display: flex;
                padding: 0.3125em 0.625em 0.3125em 0.625em;
                text-align: left;
                align-items: center;
                font-size: 2rem;
                // border: 1px solid black;

                .profile-user-info-item {
                    flex-grow: 0;
                }

                .profile-head-portrait {
                    width: 4em;
                    height: 4em;
                    border-radius: 50%;
                    margin-right: 0.625em;
                } 
                // 0.3125 * 2 + 4 92.5
                // 0.3125 * 4 + 1.8* 2 

                .profile-user-name {
                    font-weight: 600;
                }

                .profile-intro {
                    margin-top: 0.3em;
                    font-size: 1.6rem;
                }
            }

            .btn {
                background-color: #b0cac7;
                color: white;
            }

            .follow-btn {
                position: absolute;
                top: 2.3125em;
                right: 2em;
                transform: translateY(-50%);
                font-size: 1.7rem;
                padding: 0.15em 0.55em;
                border-radius: 1em;
            }

            .profile-data {
                display: flex;
                padding: 0 0.625em 0 0.625em;
                // border: black 1px solid;
                font-size: 1.8rem;
                line-height: 1;

                div {
                    flex: 0 0 auto;
                    margin-right: 2em;
                    // border: black 1px solid;
                    p {
                        padding: 0.3125em 0
                    }
                }
            }

        }
    }

    .post-img-one {
        padding: 0.3125em 0 0.3125em 3.125em;
        width: 15em;
        // border:black 1px solid;
        img {
            display: block;
            max-width: 100%;
            border-radius: 0.1875em;
        }
    }

    .post-img-more {
        padding-top: 0.3125em;
        display: flex;
        // border: 1px solid black;
        margin-left: 3.125em;
        flex-wrap: wrap;

        img {
            width: 5em;
            flex: 0 0 auto;
            height: 5em;
            margin-right: 0.3125em;
            margin-bottom: 0.3125em;
            border-radius: 0.1875em;
        }
    }
</style>