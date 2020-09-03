import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      userid: 1,
      tlscrollTop: null,
      profilescrollTop: null,
      isNewPost: false,
      timelineData: null,
      profileData: null,
      repostData: null
    },
    mutations: {
        login(state, userid) {
            state.userid = userid;
            // console.log("vuex userid 已经更改成功");
        },

        updatetlscrollTop(state, tlscrollTop) {
            state.tlscrollTop = tlscrollTop;
            // console.log("tlscrollTop 已经更改成功");
        },

        updateProfilescrollTop(state, profilescrollTop) {
            state.profilescrollTop = profilescrollTop;
            // console.log("profilescrollTop 已经更改成功");
        },

        updateisNewPost(state) {
            state.isNewPost = !state.isNewPost;
            // console.log("updateisNewPost 已更改" + state.isNewPost)
        },

        updateTimelineData(state, timelineData) {
            state.timelineData = timelineData;
            // console.log("timelineData 已经更改成功");
        },

        updateProfileData(state, profileData) {
            state.profileData = profileData;
        },

        cancelLike(state, originalpostid) {
            if (state.timelineData) {
                for (let i of state.timelineData) {
                    if (Number(i.originalpostid) === Number(originalpostid)) {
                        for (let j=0; j<i.likes.length; j++) {
                            if (i.likes[j].userid === state.userid) {
                                i.likes.splice(j, 1);
                                console.log("==================本地数据已更改")
                                break
                            }
                        }
                    }
                }
            }
        },

        cancelLikeProfile(state, originalpostid) {
            if (state.profileData) {
                for (let i of state.profileData.ops) {
                    if (Number(i.originalpostid) === Number(originalpostid)) {
                        for (let j=0; j<i.likes.length; j++) {
                            if (i.likes[j].userid === state.userid) {
                                i.likes.splice(j, 1);
                                console.log("==================本地数据已更改")
                                break
                            }
                        }
                    }
                }
            }
        },

        addLike(state, payload) {
            if (state.timelineData) {
                for (let i of state.timelineData) {
                    if (Number(i.originalpostid) === Number(payload.originalpostid)) {
                        i.likes.push({userid: state.userid, time: payload.time})
                        console.log("==================本地数据已更改")
                        break
                    }
                }
            }
        },

        addLikeProfile(state, payload) {
            if (state.profileData) {
                for (let i of state.profileData.ops) {
                    if (Number(i.originalpostid) === Number(payload.originalpostid)) {
                        i.likes.push({userid: state.userid, time: payload.time})
                        console.log("==================本地数据已更改")
                        break
                    }
                }
            }
        },     

        addFollower(state) {
            state.profileData.followers.push({
                following: state.profileData.info.userid,
                userid: state.userid
            })
            console.log(state.profileData.followers)
        },

        cancelFollower(state) {
            for (let i=0; i<state.profileData.followers.length; i++) {
                if (state.profileData.followers[i].userid === state.userid) {
                    state.profileData.followers.splice(i, 1);
                    break
                }
            }
            console.log(state.profileData.followers)
        },

        addRepost(state, payload) {
            let newopid = payload.newopid;
            let opid = payload.opid;
            if (state.timelineData) {
                for (let i of state.timelineData) {
                    if (i.originalpostid === opid) {
                        i.reposts.push(newopid);
                        return true
                    }
                }                  
            }

            if (state.profileData) {
                for (let i of state.profileData.ops) {
                    if (i.originalpostid === opid) {
                        i.reposts.push(newopid);
                        return true
                    }
                }
            }
        },

        addComment(state, payload) {
            if (state.timelineData) {
                for (let i of state.timelineData) {
                    if (i.originalpostid === payload.opid) {
                        i.comments.push(payload.newComment);
                        return true
                    }
                }                  
            }

            if (state.profileData) {
                for (let i of state.profileData.ops) {
                    if (i.originalpostid === payload.opid) {
                        i.comments.push(payload.newComment);
                        return true
                    }
                }
            }        
        },

        addReply(state, payload) {
            if (state.timelineData) {
                for (let i of state.timelineData) {
                    if (i.originalpostid === payload.opid) {
                        for (let j of i.comments) {
                            if (j.commentid === payload.commentid) {
                                if (!j.replies) {
                                    j.replies = [];
                                }
                                j.replies.push(payload.newReply);
                                return true
                            }
                        }
                        return true
                    }
                }                  
            }

            if (state.profileData) {
                for (let i of state.profileData.ops) {
                    if (i.originalpostid === payload.opid) {
                        for (let j of i.comments) {
                            if (j.commentid === payload.commentid) {
                                if (!j.replies) {
                                    j.replies = [];
                                }
                                j.replies.push(payload.newReply);
                                return true
                            }
                        }                        
                    }
                }
            }      
        },
        getOriginalPostbyID(state, originalpostid) {
            console.log("opid是"+originalpostid)

            if (state.timelineData) {
                for (let i of state.timelineData) {
                    if (i.originalpostid === originalpostid) {
                        state.repostData = i;
                        return true
                    }
                }            
            }

            if (state.profileData) {
                for (let i of state.profileData.ops) {
                    if (i.originalpostid === originalpostid) {
                        state.repostData = i;
                        return true
                    }
                }
            }
        }
    },

    actions: {
        requestTimelineData(context, userid) {
            axios.get(`https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_timeline?userid=${userid}`)
            .then(response => {
                console.log(response.data);
                for (let i of response.data) {
                    if (i.comments === undefined) {
                        i.comments = [];
                    }
                    if (i.likes === undefined) {
                        i.likes = [];
                    }
                    if (i.reposts === undefined) {
                        i.reposts = [];
                    }
                }
                if (response.data.length > 1) {
                    response.data.sort((x, y) => {
                        return y.time - x.time;
                    })
                }
                context.commit("updateTimelineData", response.data) ;
            })
            .catch(function (error) {
                console.log(error);
            });
        },

        requestProfileData(context, profileid) {
            axios({
                method: "get",
                url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_profile",
                params: {
                    profileid: profileid
                }
            }).then(res => {
                console.log(res.data)
                for (let i of res.data.ops) {
                    if (!i.likes) {
                        i.likes = [];
                    }
                    if (!i.comments) {
                        i.comments = [];
                    }
                    if (!i.reposts) {
                        i.reposts = [];
                    }
                }

                if (res.data.ops.length > 1) {
                    res.data.ops.sort((x,y) => {
                        return y.time - x.time
                    })
                }
                
                context.commit("updateProfileData", res.data)
            });
        },

        cancelLike(context, originalpostid) {
            context.commit("cancelLike", originalpostid);
            axios({
                method: "get",
                url:"https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_like",
                params: {
                    method: "cancel",
                    userid: context.state.userid, // 登录者id,
                    originalpostid: originalpostid
                }
            }).then(res => {
                console.log("数据库数据已更新")
            }).catch(err => {
                console.log(err)
            })
        },

        cancelLikeProfile(context, originalpostid) {
            context.commit("cancelLikeProfile", originalpostid);
            axios({
                method: "get",
                url:"https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_like",
                params: {
                    method: "cancel",
                    userid: context.state.userid, // 登录者id,
                    originalpostid: originalpostid
                }
            }).then(res => {
                console.log("数据库数据已更新")
            }).catch(err => {
                console.log(err)
            })
        },

        addLike(context, originalpostid) {
            let day = new Date();
            let time = day.getTime();
            context.commit("addLike", {originalpostid: originalpostid, time: time});
            axios({
                method: "get",
                url:"https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_like",
                params: {
                    method: "add",
                    userid: context.state.userid, // 登录者id
                    originalpostid: originalpostid,
                    time: time
                }
            }).then(res => {
                console.log(res.data)
                console.log("数据库数据已更新")
            }).catch(err => {
                console.log(err)
            })
        },

        addLikeProfile(context, payload) {
            context.commit("addLikeProfile", {originalpostid: payload.originalpostid, time: payload.time});
            axios({
                method: "get",
                url:"https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_like",
                params: {
                    method: "add",
                    userid: context.state.userid, // 登录者id
                    originalpostid: payload.originalpostid,
                    time: payload.time
                }
            }).then(res => {
                console.log(res.data)
                console.log("数据库数据已更新")
            }).catch(err => {
                console.log(err)
            })
        },       
    },

    modules: {
    }
})
