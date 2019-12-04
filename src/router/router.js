import App from '../App'
import recordingMain from '../pages/recording/main'
import auditing from '../pages/recording/auditing'
import downline from '../pages/recording/downline'
import notpass from '../pages/recording/notpass'
import online from '../pages/recording/online'
import unpublished from '../pages/recording/unpublished'
import releaseVideo from '../pages/recording/releaseVideo'
import videoAuditing from '../pages/videomanage/auditing'
import videoDownline from '../pages/videomanage/downline'
import videoMain from '../pages/videomanage/main'
import videoNotpass from '../pages/videomanage/notpass'
import videoOnline from '../pages/videomanage/online'
import upImage from '@/components/upImage'
import audit from '@/pages/notice/audit'
import iframe from '@/pages/notice/MIframe'
import uploadVideo from '../pages/videomanage/uploadVideo'
import aliyunUpVideo from '@/components/aliyunUpVideo'
import video from '../pages/videomanage/video'
import album from '../pages/album/album'//视频专辑管理
import order from '../pages/albumOrder/order'//视频专辑订单
import audioOrder from '../pages/audioOrder/order'//音频专辑订单
import uploadAlbum from '../pages/album/uploadAlbum'
import albummain from '../pages/album/albummain'
import details from '../pages/album/details'
import audiomanage from '../pages/audiomanage/audiomain'
import audioup from '../pages/audiomanage/audioup'
import audioaudit from '../pages/audiomanage/audioaudit'
import nothrough from '../pages/audiomanage/nothrough'
import audiodown from '../pages/audiomanage/audiodown'
import uploadaudio from '../pages/audiomanage/uploadaudio'
import audioalbummain from '../pages/audioalbum/albummain'
import albumlist from '../pages/audioalbum/albumlist'
import audioaddalbum from '../pages/audioalbum/audioaddalbum'
import audioalbumsee from '../pages/audioalbum/audioalbumsee'
import account from '../pages/account/account'        //财富信息
import accountmain from '../pages/account/accountmain'
import account_detail from '../pages/account_detail/account_detail'      //消费记录
import account_detailmain from '../pages/account_detail/account_detailmain'
import upImageAll from '@/components/upImageAll'//上传图片
import upImageAll2 from '@/components/upImageAll2'//上传图片

export default [{
    path: '/',
    component: App,
    children: [{
        path: 'recording',
        name:'recording',
        component: recordingMain,
        redirect:'recording/unpublished',
        children:[{
        	path:'auditing',
            name:'auditing',
        	component: auditing,
        },{
        	path:'downline',
            name:'downline',
        	component: downline,
        },{
        	path:'notpass',
            name:'notpass',
        	component: notpass,
        },{
        	path:'online',
            name:'online',
        	component: online,
        },{
        	path:'unpublished',
            name:'unpublished',
        	component: unpublished,
        }]
    },{
        path: 'album',
        name:'album',
        component: albummain,
        redirect:'album/album',
        children:[{
            path:'album',
            name:'album',
            component: album,
        }]
    },{
        path: 'albumOrder/order',
        name:'albumOrder',
        component:order
    },{
        path: 'audioOrder/order',
        name:'audioOrder',
        component:audioOrder
    },{
        path: 'account',
        name:'account',
        component: accountmain,
        redirect:'account/account',
        children:[{
            path:'account',
            name:'account',
            component: account,
        }]
    },{
        path: 'account_detail',
        name:'account_detail',
        component: account_detailmain,
        redirect:'account_detail/account_detail',
        children:[{
            path:'account_detail',
            name:'account_detail',
            component: account_detail,
        }]
    },{
        path: 'video',
        name:'video',
        component: videoMain,
        redirect:'video/auditing',
        children:[{
            path:'auditing',
            name:'auditing',
            component: videoAuditing,
        },{
            path:'downline',
            name:'downline',
            component: videoDownline,
        },{
            path:'notpass',
            name:'notpass',
            component: videoNotpass,
        },{
            path:'online',
            name:'online',
            component: videoOnline,
        }]
    },{
        path:'image',
        component: upImage,
        name: 'iamge'
    },{
        path:'releaseVideo',
        component: releaseVideo,
        name: 'releaseVideo'
    },{
        path:'uploadVideo',
        component: uploadVideo,
        name: 'uploadVideo'
    },{
        path:'audit',
        component: audit,
        name: 'audit'
    },{
        path:'aliyunUpVideo',
        component: aliyunUpVideo,
        name: 'aliyunUpVideo'
    },{
        path:'videoPlay',
        component: video,
        name: 'videoPlay'
    },{
        path:'iframe',
        component: iframe,
        name: 'iframe'
    },{
        path:'uploadAlbum',
        component: uploadAlbum,
        name: 'uploadAlbum'
    },{
        path:'details',
        component: details,
        name: 'details'
    },{
        path:'uploadaudio',
        component: uploadaudio,
        name: 'uploadaudio'
    },{
        path: 'audio',
        name:'audio',
        component: audiomanage,
        redirect:'audio/audioup',
        children:[{
            path:'audioup',
            name:'audioup',
            component: audioup,
        },{
            path:'audioaudit',
            name:'audioaudit',
            component: audioaudit,
        },{
            path:'nothrough',
            name:'nothrough',
            component: nothrough,
        },{
            path:'audiodown',
            name:'audiodown',
            component: audiodown,
        }]
    },{
        path: 'audioalbum',
        name:'audioalbum',
        component: audioalbummain,
        redirect:'audioalbum/albumlist',
        children:[{
            path:'albumlist',
            name:'albumlist',
            component: albumlist,
        }]
    },{
        path:'audioaddalbum',
        component: audioaddalbum,
        name: 'audioaddalbum'
    },{
        path:'audioalbumsee',
        name:'audioalbumsee',
        component: audioalbumsee,
    }]
}]