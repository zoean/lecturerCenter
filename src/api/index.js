import axios from 'axios'
import qs from 'qs'
import {
  dateSetUrl,
  downVideoUrl,
  eorkOrderUrl,
  videoTypeListUrl,
  getVoucherUrl,
  defImgListUrl,
  coverImgListUrl,
  publishUpVideoUrl,
  publishVideoUrl,
  rePublishUpVideoUrl,
  rePublishUpAlbumUrl,
  refreshUploadUrl,
  keyWordUrl,
  videoPlayUrl,
  seeCountUrl,
  liveSeeCountUrl,
  lecturerJurisdictionUrl,
  saveAlbumUrl, //新建保存专辑
  seeAlbumUrl, //新建保存专辑
  albumListUrl,        //专辑列表
  albumDataUrl,        //视频专辑列表
  getLabelUrl,         //一级分类标签
  oneDataUrl,         //一级分类
  twoDataUrl,         //二级分类
  downAlbumUrl,       //下架视频专辑
  onAlbumUrl,         //上架视频专辑
  deleteAlbumUrl,      //删除专辑
  transferAlbumUrl,      //转移专辑
  audioListUrl,//音频列表
  audioClassificationUrl,      //音频专辑分类
  audioAlbumListUrl,    //音频专辑列表
  audioalbumseeUrl,      //音频专辑详情
  audioalbumdownUrl,      //音频专辑下架
  audiodownUrl,      //专辑内音频下架
  audioalbumupUrl,    //音频专辑上架
  audioalbumdeleteUrl,      //音频专辑删除
  audioshiftUrl,      //音频转移
  audioalbumallUrl,      //音频专辑下拉列表
  audioalbumuploadimgUrl,     //音频专辑封面上传
  downAudioUrl,         //下架音频
  audioPlayUrl, //音频播放
  audioDetaileUrl,//音频详情
  audioAlbumUrl,//音频所属专辑
  getUploadAuthUrl,//获取上传凭证
  refreshUploadAuthUrl,//刷新上传凭证
  creatAudioUrl,//新建音频
  audioalbumlabelUrl,      //音频专辑标签列表
  audioalbumeditsaveUrl,      //音频专辑编辑保存
  audioEditUrl,//编辑音频
  albumOrderUrl,//视频专辑订单
  stopSaleUrl,//停售
  recoveryUrl,//恢复销售
  getLecturerAuthUrl,
  ggetmianAlbumListUrl,//转移专辑列表
  courseUrl,//设置/取消试听课
  szpxUrl,//直播间设置排序
  saleStatusUrl,//音频专辑设置停售恢复销售
  audioOrderUrl,
  audiogetAuthUrl,//音频专辑获取讲师权限
  audioCourseUrl,//音频详情设置取消试听课
  videoNumUrl,//获取专辑内视频数量
  videoSortUrl,//设置专辑排序
  videoSzpxUrl,//设置专辑内视频排序
  audioNumUrl,//获取专辑内音频数量
  audioSortUrl,//设置专辑排序(音频)
  audioSzpxUrl//设置专辑内音频排序
} from './resource'
export default {
  audioSzpxFn(params) {
    return fetchGET(audioSzpxUrl, params) //设置专辑内音频排序
  },
  audioSortFn(params) {
    return fetchGET(audioSortUrl, params) //设置专辑排序(音频)
  },
  audioNumFn(params) {
    return fetchGET(audioNumUrl, params) //获取专辑内音频数量
  },
  videoSzpxFn(params) {
    return fetchGET(videoSzpxUrl, params) //设置专辑内视频排序
  },
  videoSortFn(params) {
    return fetchGET(videoSortUrl, params) //设置专辑排序
  },
  videoNumFn(params) {
    return fetchGET(videoNumUrl, params) //获取专辑内视频数量
  },
  audioCourseFn(params) {
    return fetchPOST(audioCourseUrl, params) //音频专辑获取讲师权限
  },
  audiogetAuthFn(params) {
    return fetchGET(audiogetAuthUrl, params) //音频专辑获取讲师权限
  },
  audioOrderFn(params) {
    return fetchGET(audioOrderUrl, params) //音频专辑订单
  },
  saleStatuFn(params) {
    return fetchPOST(saleStatusUrl, params) //音频专辑设置停售恢复销售
  },
  cszpxFn(params) {
    return fetchGET(szpxUrl, params) //直播间设置排序
  },
  courseFn(params) {
    return fetchGET(courseUrl, params) //设置/取消试听课
  },
  zhuanyiFn(params) {
    return fetchGET(ggetmianAlbumListUrl, params) //转移专辑列表
  },
  getLecturerAuthFn(params) {
    return fetchGET(getLecturerAuthUrl, params) //获取创建付费专辑权限
  },
  recoveryFn(params) {
    return fetchGET(recoveryUrl, params) //恢复销售
  },
  stipSaleFn(params) {
    return fetchGET(stopSaleUrl, params) //停售
  },
  albumOrderFn(params) {
    return fetchPOST(albumOrderUrl, params) //视频专辑订单
  },
  audioEditFn(params) {
    return fetchPOST(audioEditUrl, params) //新建音频
  }, 
  creatAudioFn(params) {
    return fetchPOST(creatAudioUrl, params) //新建音频
  }, 
  getUploadAuthFn(params) {
    return fetchPOST(getUploadAuthUrl, params) //获取上传凭证
  }, 
  refreshUploadAuthFn(params) {
    return fetchPOST(refreshUploadAuthUrl, params) //刷新上传凭证
  }, 
 audioAlbumFn(params) {
    return fetchGET(audioAlbumUrl, params) //音频详情
  },  
  audioDetaileFn(params) {
    return fetchGET(audioDetaileUrl, params) //音频详情
  }, 
  audioPlayFn(params) {
    return fetchGET(audioPlayUrl, params) //音频播放
  }, 
  dateAudioListFn(params) {
    return fetchGET(audioListUrl, params) //音频列表
  }, 
  deleteAlbumFn(params) {
    return fetchGET(deleteAlbumUrl, params) //删除专辑
  },
  seeAlbumFn(params) {
    return fetchGET(seeAlbumUrl, params) //删除专辑
  },
  saveAlbumUrlFn(params) {
    return fetchPOST(saveAlbumUrl, params) //新建保存专辑
  },
  getdataOneFn(params) {
    return fetchGET(getLabelUrl, params) //一级分类标签
  },
  dataOneFn(params) {
    return fetchGET(oneDataUrl, params) //一级分类
  },
  dataTwoFn(params) {
    return fetchGET(twoDataUrl, params) //二级分类
  },
  datealbumListFn(params) {
    return fetchGET(albumListUrl, params) //专辑列表
  }, 
  transferAlbumFn(params) {
    return fetchPOST(transferAlbumUrl, params) //转移专辑
  }, 
  datealbumFn(params) {
    return fetchGET(albumDataUrl, params) //视频专辑列表
  },
  dateSetFn(params) {
    return fetchPOST(dateSetUrl, params)
  },
  downVideoFn(params) {
    return fetchGET(downVideoUrl, params)//下架视频
  },
  downAlbumFn(params) {
    return fetchGET(downAlbumUrl, params)//下架视频专辑
  },
  onAlbumFn(params) {
    return fetchGET(onAlbumUrl, params)//上架视频专辑
  },
   downAudioFn(params) {
    return fetchGET(downAudioUrl, params)//下架音频
  },
  eorkOrderFn(params) {
    return fetchGET(eorkOrderUrl, params)
  },
  videoTypeListFn(params) {
    return fetchGET(videoTypeListUrl, params)
  },
  getVoucherFn(params) {
    return fetchPOST(getVoucherUrl, params)
  },
  defImgListFn(params) {
    return fetchGET(defImgListUrl, params)
  },
  coverImgListFn(params) {
    return fetchPOST(coverImgListUrl, params)
  },
  publishUpVideoFn(params) {
    return fetchPOST(publishUpVideoUrl, params)
  },
  publishVideoFn(params) {
    return fetchPOST(publishVideoUrl, params)
  },
  refreshUploadFn(params) {
    return fetchPOST(refreshUploadUrl, params)
  },
  keyWordFn(params) {
    return fetchGET(keyWordUrl, params)
  },
  videoPlayFn(params) {
    return fetchPOST(videoPlayUrl, params)
  },
  seeCountFn(params) {
    return fetchGET(seeCountUrl, params)
  },
  liveSeeCountFn(params) {
    return fetchGET(liveSeeCountUrl, params)
  },
  lecturerJurisdictionFn(params) {
    return fetchPOST(lecturerJurisdictionUrl, params)
  },
  rePublishUpVideoFn(params) {
    return fetchPOST(rePublishUpVideoUrl, params)
  },
  rePublishUpAlbumFn(params) {
    return fetchPOST(rePublishUpAlbumUrl, params)
  },
  audioClassificationFn(params) {
    return fetchGET(audioClassificationUrl, params)
  },
  audioAlnumListFn(params) {
    return fetchGET(audioAlbumListUrl, params)
  },
  audioListFn(params) {
    return fetchGET(audioListUrl, params)
  },
  audioAlbumListFn(params) {
    return fetchGET(audioAlbumListUrl, params)
  },
  audioalbumseeFn(params) {
    return fetchGET(audioalbumseeUrl, params)
  },
  audioalbumdownFn(params) {
    return fetchGET(audioalbumdownUrl, params)
  },
  audiodownFn(params) {
    return fetchGET(audiodownUrl, params)
  },
  audioalbumupFn(params) {
    return fetchGET(audioalbumupUrl, params)
  },
  audioalbumdeleteFn(params) {
    return fetchGET(audioalbumdeleteUrl, params)
  },
  audioshiftFn(params) {
    return fetchGET(audioshiftUrl, params)
  },
  audioalbumallFn(params) {
    return fetchGET(audioalbumallUrl, params)
  },
  audioalbumlabelFn(params) {
    return fetchGET(audioalbumlabelUrl, params)
  },
  audioalbumeditsaveFn(params) {
    return fetchPOST(audioalbumeditsaveUrl, params)
  }
}

export function fetchPOST(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(response => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      })
  })
}

export function fetchGET(url, params) {
  // axios.get(url, {
  // 　params
  // }).then(function (response) {
  //   resolve(response);
  // }).catch(function (error) {
  //   reject(error);
  // });
  return new Promise((resolve, reject) => {
    // axios({
    //   method: 'get',
    //   url: url,
    //   headers: {
    //     "Accept":"*/*",
    //   },
    //   params: params
    // })
    // .then(response => {
    //   resolve(response);
    // })
    // .catch((error) => {
    //   reject(error);
    // })
    axios.get(url, {
      params
    }).then(function (response) {
      resolve(response);
    }).catch(function (error) {
      reject(error);
    });
  })
}