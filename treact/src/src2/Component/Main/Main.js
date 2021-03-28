import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import firebase from "firebase"
import images from '../Themes/Images'
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard'
import './Main.css'
import ChatBoard from './../ChatBoard/ChatBoard'
import Head from '../../../components/headers/light.js'

const myFirebase=firebase;
const myFirestore=firebase.firestore();

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null
        }
        this.currentUserId = 0
        this.currentUserAvatar = ""
        this.currentUserNickname = ""
        this.listUser = []
        this.data={
            ID: 'id',
            PHOTO_URL: 'photoUrl',
            NICKNAME: 'nickname',
            ABOUT_ME: 'aboutMe',
            NODE_MESSAGES: 'messages',
            NODE_USERS: 'users',
            UPLOAD_CHANGED: 'state_changed',
            DOC_ADDED: 'added',
            PREFIX_IMAGE: 'image/'
        }
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = async () => {
        myFirebase.auth().onAuthStateChanged(async (user) =>{
            if (!user) {
                this.setState({isLoading: false}, () => {
                    this.props.history.push('/components/innerPages/LoginPage')
                })
            } 
            else {
                //alert("here")alert(user.uid)
                if (user) {
                    const result = await myFirestore
                        .collection(this.data.NODE_USERS)
                        .where("uid", '==', user.uid)
                        .get()

                    if (result.docs.length === 0) {
                        // Set new data since this is a new user
                        alert(user.uid)
                        myFirestore
                            .collection('users')
                            .doc(user.uid)
                            .set({
                                uid:user.uid,
                                id: user.uid,
                                nickname: user.displayName,
                                aboutMe: '',
                                photoUrl: user.photoURL
                            },{ merge: true })
                            .then(data => {
                                // Write user info to local
                                this.data.ID= user.uid
                                this.data.NICKNAME= user.displayName
                                this.data.PHOTO_URL=user.photoURL
                                this.currentUserAvatar=this.data.PHOTO_URL
                                this.currentUserNickname=this.data.NICKNAME
                                this.setState({isLoading: false}, () => {
                                    this.props.showToast(1, 'Login success')
                                    this.props.history.push('/main')
                                })
                                this.getListUser();
                            })
                    } else {
                        // Write user info to local
                        this.data.ID=result.docs[0].data().uid
                        this.data.NICKNAME=result.docs[0].data().nickname
                        this.data.PHOTO_URL=result.docs[0].data().photoUrl
                        this.data.ABOUT_ME=result.docs[0].data().aboutMe
                        this.setState({isLoading: false}, () => {
                            this.props.showToast(1, 'Login success')
                            //this.props.history.push('/main')
                        })
                        this.getListUser();
                    }
                    this.currentUserAvatar=this.data.PHOTO_URL
                    this.currentUserNickname=this.data.NICKNAME
                    
                } else {
                    this.props.showToast(0, 'User info not available')
                }
            }
        });
    }

    getListUser = async () => {
        const res=await myFirestore.collection("users").doc(this.data.ID).get()
        const friends=res.data().friends
        if(!friends.length)return;
        const result = await myFirestore.collection("users").where("uid","in",friends).get()
        if (result.docs.length > 0) {
            this.listUser = [...result.docs]
            this.setState({isLoading: false})
        }
    }

    onLogoutClick = () => {
        this.setState({
            isOpenDialogConfirmLogout: true
        })
    }

    doLogout = () => {
        this.setState({isLoading: true})
        myFirebase
            .auth()
            .signOut()
            .then(() => {
                this.setState({isLoading: false}, () => {
                    localStorage.clear()
                    this.props.showToast(1, 'Logout success')
                    this.props.history.push('/chatlogin')
                })
            })
            .catch(function (err) {
                this.setState({isLoading: false})
                this.props.showToast(0, err.message)
            })
    }

    hideDialogConfirmLogout = () => {
        this.setState({
            isOpenDialogConfirmLogout: false
        })
    }

    onProfileClick = () => {
        this.props.history.push('/profile')
    }

    renderListUser = () => {
        if (this.listUser.length > 0) {
            let viewListUser = []
            this.listUser.forEach((item, index) => {
                if (item.data().id !== this.data.ID) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                this.state.currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.setState({currentPeerUser: item.data()})
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.data().photoUrl}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                <span className="textItem">{`Nickname: ${
                    item.data().nickname
                    }`}</span>
                                <span className="textItem">{`About me: ${
                                    item.data().aboutMe ? item.data().aboutMe : 'Not available'
                                    }`}</span>
                            </div>
                        </button>
                    )
                }
            })
            return viewListUser
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="root">
                {/* Header */}
                {(<Head />)}
                {/* Body */}
                <div className="body">
                    <div className="viewListUser"> {this.renderListUser()}</div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <ChatBoard
                                currentPeerUser={this.state.currentPeerUser}
                                showToast={this.props.showToast}
                            />
                        ) : (
                            <WelcomeBoard
                                currentUserNickname={this.currentUserNickname}
                                currentUserAvatar={this.currentUserAvatar}
                            />
                        )}
                    </div>
                </div>

                {/* Dialog confirm */}
                {this.state.isOpenDialogConfirmLogout ? (
                    <div className="viewCoverScreen">
                        {this.renderDialogConfirmLogout()}
                    </div>
                ) : null}

                {/* Loading */}
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </div>
        )
    }

    renderDialogConfirmLogout = () => {
        return (
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
                    <span className="titleDialogConfirmLogout">Are you sure to logout?</span>
                </div>
                <div className="viewWrapButtonDialogConfirmLogout">
                    <button className="btnYes" onClick={this.doLogout}>
                        YES
                    </button>
                    <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
                        CANCEL
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(Main)
