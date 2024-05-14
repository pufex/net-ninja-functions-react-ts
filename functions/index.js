const functions = require("firebase-functions")
const admin = require("firebase-admin");
const { HttpsError } = require("firebase-functions/v1/auth");

admin.initializeApp();

// auth trigger (new user signup)

exports.newUserSignup = functions.auth.user().onCreate((user) => {
    return admin.firestore()
        .collection("users")
        .doc(user.uid)
        .set({
            email: user.email,
            bio: "",
            upvotedOn: [],
        })
})

// auth trigger (user deleted)

exports.userDelete = functions.auth.user().onDelete((user) => {
    return admin.firestore()
        .collection("users")
        .doc(user.uid)
        .delete()
})

// http callable function (adding tutorial request)

exports.addRequest = functions.https.onCall((data, ctx) => {
    if(!ctx.auth){
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Only logged users can add requests."
        )
    }

    const {title} = data
    
    if(title.length > 30){
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Title must be no longer than 30 characters."
        )
    }

    return admin.firestore()
        .collection("requests")
        .add({
            title,
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            upvotes: 0,
        })
})

// upvote callable function

exports.upvoteRequest = functions.https.onCall(async (data, ctx) => {
    if(!ctx.auth){
        throw new HttpsError(
            "unauthenticated",
            "Log in to upvote requests."
        )
    }
    const userDoc = admin.firestore()
        .collection("users")
        .doc(ctx.auth.uid)
    try{
        const doc = await userDoc.get()
        const userData = doc.data();
        if(userData.upvotedOn.includes(data.id)){
            throw new HttpsError(
                "failed-precondition",
                "Cannot upvote more than once."
            )
        }
        await userDoc.update({
            upvotedOn: [...userData.upvotedOn, data.id],
        })
        const request = admin.firestore()
                .collection("requests")
                .doc(data.id)
        return request.update({
            upvotes: admin.firestore.FieldValue.increment(1),
        })
    }catch(err){
        return {message: err}
    }

})

// firestore trigger for tracking activity 

exports.logActivities = functions.firestore
    .document("/{collection}/{id}")
    .onCreate((snap, ctx) => {
        console.log(snap.data());

        const collection = ctx.params.collection;
        const id = ctx.params.id

        const activities = admin.firestore().collection("activities");

        if(collection === "requests"){
            return activities.add({text: "a new tutorial request was added." })
        }
        if(collection === "users"){
            return activities.add({text: "a new user request signed up." })
        }
        else return null
    })