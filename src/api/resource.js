import {
  API_ROOT
} from './config.js'
import api from './index.js';
import util from '@/utils/util';
import constant from '@/utils/constant'
const ggcj = {
  dateSet: '/video/lecturerVideo/list.video',//视频管理列表（审核中，未通过，已上架，已下架）
  downVideo:'/video/lecturerVideo/withdraw.video',
  eorkOrder:'/video/lecturerVideo/getWorkOrderList.video',
  videoTypeList:'/video/lecturerVideo/typelist.video',
  getVoucher:'/video/getUpload.wp', //获取上传凭证
  refreshUpload:'/video/refreshUpload.wp', //刷新上传凭证
  defImgList:'/video/pic/list.video',
  coverImgList:'/video/getSnapshot.wp?PageSize=5',
  publishUpVideo:'/video/lecturerVideo/publish.video', //上传视频接口
  rePublishUpVideo:'/video/lecturerVideo/rePublish.video', //重新上传视频接口
  rePublishUpAlbum:'/video/album/edit.video', //重新上传专辑接口
  publishVideo:'/video/lecturerVideo/publishLecturerVideo.video',
  keyWord:'/video/forbidden/show.video',
  videoPlay: '/video/getVideoVoucher.wp',
  liveSeeCount:'/video/lecturerVideo/playCount.video',//直播讲师已上架视频个数
  seeCount:'/video/lecturerVideo/videoNum.video',//视频管理已上架视频个数
  lecturerJurisdiction:'/lecturer/findLecturerDredge.wp',
  albumList:'/video/album/getVideoAlbums.video',//专辑
  album:'/video/album/list.video',//视频专辑管理
  getLabel:'/video/label/getVideoLabels.video',//一级分类下标签
  oneLabel:'/video/type/getTopTypes.video',//一级分类
  twoLabel:'/video/type/getChildTypes.video',//二级分类
  downAlbum:'/video/album/toDown.video',   //下架视频专辑
  onAlbum:'/video/album/toShelf.video',//上架视频专辑
  saveAlbum:'/video/album/save.video',//新建保存专辑
  deleteAlbum:'/video/album/toDel.video',//删除专辑
  seeAlbum:'/video/album/getAlbumDetailInfo.video',//查看专辑
  transferAlbum:'/video/album/transferVideos.video',//转移专辑
  audioList:'/audio/interface/audio/list.audio', //音频列表 type=2已上架   type=1审核中  type=3未通过   type=4已下架
  audioClassification:'/audio/interface/type/list.audio',//获取音频专辑分类

  audioAlbumList:'/audio/interface/album/list.audio',//获取音频专辑列表
  audioalbumsee:'/audio/interface/album/info.audio',//获取音频详情
  audioalbumdown:'/audio/interface/album/soldOut.audio',//音频专辑下架
  audiodown:'/audio/interface/audio/soldOut.audio',//专辑内音频下架
  audioalbumup:'/audio/interface/album/putaway.audio',//音频专辑上架
  audioalbumdelete:'/audio/interface/album/del.audio',//音频专辑删除
  audioshift:'/audio/interface/album/shift.audio',//音频转移
  audioalbumall:'/audio/interface/album/all.audio',//音频专辑下拉列表
  audioalbumuploadimg:'/audio/interface/file/upload.audio',//音频封面上传
  downAudio:'/audio/interface/audio/soldOut.audio',//下架音频
  audioPlay:'/audio/interface/audio/getPlayUrl.audio',//音频播放
  audioDetaile:'/audio/interface/audio/info.audio',//音频详情
  audioAlbum:'/audio/interface/album/all.audio',//音频所属专辑（所有）
  getUploadAuth:'/audio/interface/audio/upload.audio',//获取上传凭证
  refreshUploadAuth:'/audio/interface/audio/refreshUploadAuth.audio',//刷新上传凭证
  creatAudio:'/audio/interface/audio/add.audio',//新建音频
  audioalbumuploadimg:'/audio/interface/file/upload.audio',//音频封面上传
  audioalbumuploadimg:'/audio/interface/file/upload.audio',//音频封面上传
  audioalbumlabel:'/audio/interface/label/all.audio',//音频专辑标签列表
  audioalbumeditsave:'/audio/interface/album/save.audio',//音频专辑编辑保存
  audioEdit:'/audio/interface/audio/edit.audio',//编辑音频
  albumOrder:'/video/order/list.video',//视频专辑订单
  audioOrder:'/audio/interface/album/orderpage.audio',//音频专辑订单
  stopSale:'/video/album/toStopSale.video',//停售
  recovery:'/video/album/toSale.video',//恢复销售
  getLecturerAuth:'/video/album/getLecturerAuth.video',//获取创建付费专辑权限
  getmianAlbumList:'/video/album/getFreeAlbums.video',//转移专辑列表
  course:'/video/album/editVideo.video',//设置/取消试听课
  szpx:'/video/album/editRoomOrderBy.video',//直播间设置排序
  saleStatus:'/audio/interface/album/saleStatus.audio',//音频专辑设置停售恢复销售
  audiogetAuth:'/audio/interface/album/payModel.audio',//音频专辑获取讲师权限
  audioCourse:'/audio/interface/audio/audition.audio',//音频详情设置取消试听课
  videoNum:'/video/lecturerVideo/getVideoNum.video',//获取专辑内视频数量
  videoSort:'/video/album/editSort.video',//设置专辑排序（视频）
  videoSzpx:'/video/album/editVideoSort.video',//设置专辑内视频排序
  audioNum:'/audio/interface/audio/getAudioNum.audio',//获取专辑内音频数量
  audioSort:'/audio/interface/album/editSort.audio',//设置专辑排序(音频)
  audioSzpx:'/audio/interface/album/editAudioSort.audio'//设置专辑内音频排序
}
export const audioSzpxUrl = API_ROOT.concat(ggcj.audioSzpx)//设置专辑内音频排序
export const audioSortUrl = API_ROOT.concat(ggcj.audioSort)//设置专辑排序(音频)
export const audioNumUrl = API_ROOT.concat(ggcj.audioNum)//获取专辑内音频数量
export const videoSzpxUrl = API_ROOT.concat(ggcj.videoSzpx)//设置专辑内视频排序
export const videoSortUrl = API_ROOT.concat(ggcj.videoSort)//设置专辑排序
export const videoNumUrl = API_ROOT.concat(ggcj.videoNum)//获取专辑内视频数量
export const audioCourseUrl = API_ROOT.concat(ggcj.audioCourse)//音频详情设置取消试听课
export const audiogetAuthUrl = API_ROOT.concat(ggcj.audiogetAuth)//音频专辑获取讲师权限
export const saleStatusUrl = API_ROOT.concat(ggcj.saleStatus)//音频专辑设置停售恢复销售
export const szpxUrl = API_ROOT.concat(ggcj.szpx)//设置/直播间设置排序
export const courseUrl = API_ROOT.concat(ggcj.course)//设置/取消试听课
export const ggetmianAlbumListUrl = API_ROOT.concat(ggcj.getmianAlbumList)//转移专辑列表
export const getLecturerAuthUrl = API_ROOT.concat(ggcj.getLecturerAuth)//获取创建付费专辑权限
export const recoveryUrl = API_ROOT.concat(ggcj.recovery)//恢复销售
export const stopSaleUrl = API_ROOT.concat(ggcj.stopSale)//停售
export const albumOrderUrl = API_ROOT.concat(ggcj.albumOrder)//视频专辑订单
export const audioOrderUrl = API_ROOT.concat(ggcj.audioOrder)//音频专辑订单
export const audioEditUrl = API_ROOT.concat(ggcj.audioEdit)//编辑音频
export const creatAudioUrl = API_ROOT.concat(ggcj.creatAudio)//新建音频
export const getUploadAuthUrl = API_ROOT.concat(ggcj.getUploadAuth)//获取上传凭证
export const refreshUploadAuthUrl = API_ROOT.concat(ggcj.refreshUploadAuth)//刷新上传凭证
export const audioAlbumUrl = API_ROOT.concat(ggcj.audioAlbum)//音频所属专辑
export const audioDetaileUrl = API_ROOT.concat(ggcj.audioDetaile)//音频详情
export const audioPlayUrl = API_ROOT.concat(ggcj.audioPlay)//音频播放
export const downAudioUrl = API_ROOT.concat(ggcj.downAudio)//下架音频
export const audioListUrl = API_ROOT.concat(ggcj.audioList)//
export const saveAlbumUrl = API_ROOT.concat(ggcj.saveAlbum)//新建保存专辑
export const seeAlbumUrl = API_ROOT.concat(ggcj.seeAlbum)//新建保存专辑
export const deleteAlbumUrl = API_ROOT.concat(ggcj.deleteAlbum)//上架视频专辑
export const onAlbumUrl = API_ROOT.concat(ggcj.onAlbum)//上架视频专辑
export const downAlbumUrl = API_ROOT.concat(ggcj.downAlbum)//下架视频专辑
export const getLabelUrl = API_ROOT.concat(ggcj.getLabel)//一级分类
export const oneDataUrl = API_ROOT.concat(ggcj.oneLabel)//一级分类
export const twoDataUrl = API_ROOT.concat(ggcj.twoLabel)//二级分类
export const albumListUrl = API_ROOT.concat(ggcj.albumList)//专辑
export const transferAlbumUrl = API_ROOT.concat(ggcj.transferAlbum)//转移专辑
export const albumDataUrl = API_ROOT.concat(ggcj.album)//视频专辑管理
export const dateSetUrl = API_ROOT.concat(ggcj.dateSet)
export const downVideoUrl = API_ROOT.concat(ggcj.downVideo)
export const eorkOrderUrl = API_ROOT.concat(ggcj.eorkOrder)
export const videoTypeListUrl = API_ROOT.concat(ggcj.videoTypeList)
export const getVoucherUrl = API_ROOT.concat(ggcj.getVoucher)
export const defImgListUrl = API_ROOT.concat(ggcj.defImgList)
export const coverImgListUrl = API_ROOT.concat(ggcj.coverImgList)
export const publishUpVideoUrl = API_ROOT.concat(ggcj.publishUpVideo)
export const publishVideoUrl = API_ROOT.concat(ggcj.publishVideo)
export const rePublishUpVideoUrl = API_ROOT.concat(ggcj.rePublishUpVideo)
export const rePublishUpAlbumUrl = API_ROOT.concat(ggcj.rePublishUpAlbum)//重新上传专辑、编辑
export const refreshUploadUrl = API_ROOT.concat(ggcj.refreshUpload)
export const keyWordUrl = API_ROOT.concat(ggcj.keyWord)
export const videoPlayUrl = API_ROOT.concat(ggcj.videoPlay)
export const seeCountUrl = API_ROOT.concat(ggcj.seeCount)
export const liveSeeCountUrl = API_ROOT.concat(ggcj.liveSeeCount)
export const lecturerJurisdictionUrl = API_ROOT.concat(ggcj.lecturerJurisdiction)
export const audioClassificationUrl = API_ROOT.concat(ggcj.audioClassification)
export const audioAlbumListUrl = API_ROOT.concat(ggcj.audioAlbumList)
export const audioalbumseeUrl = API_ROOT.concat(ggcj.audioalbumsee)
export const audioalbumdownUrl = API_ROOT.concat(ggcj.audioalbumdown)
export const audiodownUrl = API_ROOT.concat(ggcj.audiodown)
export const audioalbumupUrl = API_ROOT.concat(ggcj.audioalbumup)
export const audioalbumdeleteUrl = API_ROOT.concat(ggcj.audioalbumdelete)
export const audioshiftUrl = API_ROOT.concat(ggcj.audioshift)
export const audioalbumallUrl = API_ROOT.concat(ggcj.audioalbumall)
export const audioalbumuploadimgUrl = API_ROOT.concat(ggcj.audioalbumuploadimg)
export const audioalbumlabelUrl = API_ROOT.concat(ggcj.audioalbumlabel)
export const audioalbumeditsaveUrl = API_ROOT.concat(ggcj.audioalbumeditsave)