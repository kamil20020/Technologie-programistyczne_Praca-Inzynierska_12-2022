﻿import { Grid, Typography, Button, Rating } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomAvatar from "../../components/common/CustomAvatar";
import CustomImage from "../../components/common/CustomImage";
import Article from "../../models/dto/Article";
import { TechnologyCategory } from "../../models/dto/TechnologyCategory";
import { setNotificationMessage, setNotificationType, setNotificationStatus } from "../../redux/slices/notificationSlice";
import { RootState } from "../../redux/store";
import ArticleAPIService from "../../services/ArticleAPIService";
import Loading from "../Loading";
import parse from 'html-react-parser';
import Comments from "./comments/Comments";
import Opinions from "./opinions/Opinions";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import { ArticleContent } from "./ArticleContent";
import { roles } from "../../keycloak/KeycloakService";
import { ArticleStatus } from "../../models/dto/ArticleStatus";
import XCloeasableDialog from "../../components/common/XCloeasableDialog";
import VerificationMessageView from "./VerificationMessageView";

export const ArticleHeader = (props: {article: Article}) => {

    const toRenderTechnologyCategoryTree = (technologyCategory: TechnologyCategory) => {

        const parentTechnologyCategory = technologyCategory.parentTechnologyCategoryDTO

        return (
            <React.Fragment>
                {parentTechnologyCategory ? toRenderTechnologyCategoryTree(parentTechnologyCategory) : null}
                <Typography textAlign="center" variant="h6" marginRight={1}>{technologyCategory.name} {"->"}</Typography>
            </React.Fragment>
        )
    }

    return (
        <Grid item xs={7} container direction="column" spacing={2}>
            <Grid item container alignItems="center" spacing={3}>
                <Grid item>
                    <CustomAvatar file={props.article.authorDTO.avatar}/>    
                </Grid>
                <Grid item>
                    <Typography textAlign="center" variant="h6">{props.article.authorDTO.nickname}</Typography>
                </Grid>
            </Grid>
            <Grid item container alignItems="center">
                <Typography textAlign="center" variant="h6">
                    Data utworzenia: {new Date(props.article.creationDate).toLocaleString()}
                </Typography>
            </Grid>
            <Grid item container alignItems="center">
                <Typography textAlign="center" variant="h6">
                    Data modyfikacji: {new Date(props.article.modificationDate).toLocaleString()}
                </Typography>
            </Grid>
            <Grid item container alignItems="center">
                {toRenderTechnologyCategoryTree(props.article.technologyDTO.technologyCategoryDTO)}
                <Typography textAlign="center" variant="h6">{props.article.technologyDTO.name}</Typography>
            </Grid>
        </Grid>
    )
}

const ArticleView = () => {

    const params = useParams();
    const articleId = params.articleId as string;   
    const userId = useSelector((state: RootState) => state.user).user.id
    const actualRoles = useSelector((state: RootState) => state.keycloak).roles
    const dispatch = useDispatch()

    const [article, setArticle] = React.useState<Article | null>(null)
    const [isSelectedComments, setIsSelectedComments] = React.useState<boolean>(true);
    const [openDeletionConfirmation, setOpenDeletionConfirmation] = React.useState<boolean>(false);

    const navigate = useNavigate()

    useEffect(() => {
        ArticleAPIService.getById(articleId)
        .then((response) => {
            setArticle(response.data)
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
            navigate("../")
        })
    }, [])

    if(article == null){
        return <Loading/>
    }

    const handleDeleteArticle = () => {
        setOpenDeletionConfirmation(false)
        ArticleAPIService.deleteArticleById(articleId)
        .then(() => {
            dispatch(setNotificationMessage("Artykuł został usunięty pomyślnie"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))
            navigate('../')
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    const handleSendToVerification = () => {

        ArticleAPIService.sendArticleToVerification(articleId)
        .then(() => {
            dispatch(setNotificationMessage("Wysłano artykuł do weryfikacji"))
            dispatch(setNotificationType('success'))
            dispatch(setNotificationStatus(true))

            setArticle({...article, status: ArticleStatus.assigning_to_verification})
        })
        .catch((error) => {
            dispatch(setNotificationMessage(error.response.data))
            dispatch(setNotificationType('error'))
            dispatch(setNotificationStatus(true))
        })
    }

    const isUserArticleAuthor = (): boolean => {
        return userId === (article as Article).authorDTO.id
    }

    return (
        <Grid item xs={12} container alignItems="start" justifyContent="center" marginTop={4}>
            <Grid item xs={10.5} container justifyContent="space-between" direction="row">
                <ArticleHeader article={article}/>
                {userId && (isUserArticleAuthor() || actualRoles.includes(roles.administrator.name)) &&
                    <Grid item xs={5} container justifyContent="end" alignItems="start" spacing={3}>     
                        <Grid item>
                            <Typography textAlign="center" variant="h6">Status: {article.status}</Typography>
                        </Grid>
                        {(article.status === ArticleStatus.new || article.status === ArticleStatus.edited) &&
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSendToVerification}
                                >
                                    Wyślij do weryfikacji
                                </Button>
                            </Grid>
                        }
                        {(article.status === ArticleStatus.refused || article.status === ArticleStatus.published) &&
                            <Grid item>
                                <VerificationMessageView articleId={article.id}/>
                            </Grid>
                        }
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate(`../create-edit/${articleId}`)}
                            >
                                Edytuj artykuł
                            </Button>
                        </Grid>
                        <Grid item>
                            <ConfirmationDialog 
                                buttonTitle="Usuń artykuł"
                                showButton={true}
                                title="Czy napewno ten artykuł powinien zostać usunięty?"
                                open={openDeletionConfirmation}
                                onAccept={handleDeleteArticle} 
                                onCancel={() => setOpenDeletionConfirmation(false)}
                            />
                        </Grid>
                    </Grid>
                }
            </Grid>
            <Grid item xs={10.5} container spacing={2}>
                <Grid item marginTop={4}>
                    <Typography textAlign="start" variant="h4">Opis technologii</Typography>
                </Grid>
                <Grid item container justifyContent="center">
                    <CustomImage alt="Ikona technologii" img={article.technologyDTO.icon}/>
                </Grid>
                <Grid item container alignItems="start" direction="column" spacing={2}>
                    {article.technologyDTO.provider &&
                        <Grid item>
                            <Typography textAlign="start" variant="h6">Dostawca: {article.technologyDTO.provider}</Typography>
                        </Grid>
                    }
                    <Grid item>
                        <Typography textAlign="start" variant="h6" marginBottom={1}>Opis:</Typography>
                        <Typography textAlign="center" variant="h6">{article.technologyDTO.description}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={10.5} marginTop={5}>
                <Typography textAlign="start" variant="h4" marginBottom={4}>{article.title}</Typography>
                <ArticleContent article={article}/>
                <Rating size="large" max={5} value={article.averageRating} precision={0.1} disabled sx={{opacity: 1, marginTop: 2}}/>
                {article.averageRating && 
                    <Typography textAlign="center" variant="h6">{article.averageRating}%</Typography>
                }
                <Grid container marginTop={3} spacing={2}>
                    <Grid item>
                        <Button
                            variant="contained"
                            color={isSelectedComments ? "success" : "secondary"}
                            onClick={() => setIsSelectedComments(true)}
                        >
                            Komentarze
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color={!isSelectedComments ? "success" : "secondary"}
                            onClick={() => setIsSelectedComments(false)}
                        >
                            Opinie
                        </Button>
                    </Grid>
                </Grid>
                <Grid container marginTop={3} spacing={2}>
                    {isSelectedComments ? <Comments articleId={articleId}/> : <Opinions article={article}/>}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ArticleView;