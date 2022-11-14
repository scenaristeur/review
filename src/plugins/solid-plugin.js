import {
  getSolidDataset,
  getThingAll,
  //getPublicAccess,
  //  getAgentAccess,
  //getSolidDatasetWithAcl,
  //getPublicAccess,
  //getAgentAccess,
  // getFile,
  // isRawData,
  // getContentType,
  //saveFileInContainer,
  // getContainedResourceUrlAll,
  // getStringNoLocaleAll,
  // createContainerAt,
  // getSourceUrl,
  // deleteFile,
  //removeThing,
  // removeAll,
  //removeStringNoLocale,
  //deleteContainer,
  //addStringNoLocale,
  setThing,
  saveSolidDatasetAt,
  createSolidDataset,
  createThing,
  //addUrl,
  buildThing,
  //overwriteFile,
  getStringNoLocale,
  getThing,
  getUrlAll,
  getUrl,
  //addDatetime,
  //  getDatetime,
  //setUrl,
  //setStringNoLocale,
  //setDecimal,
  //setInteger,
  //  getDecimal,
  //getInteger,
  // setDatetime
} from "@inrupt/solid-client";
import { FOAF, /*LDP,*/ VCARD, RDF, AS, /*RDFS, OWL*/  } from "@inrupt/vocab-common-rdf";
import { WS, SOLID } from "@inrupt/vocab-solid-common";
import { v4 as uuidv4 } from 'uuid';

import * as sc from '@inrupt/solid-client-authn-browser'
const LOCAL_STORAGE_KEY__SOLID_SESSION_RESTORE_URL = "solid_session_restore_url"
// import { fetch as node_fetch } from 'node-fetch';

const plugin = {
  install(Vue, opts = {}) {
    let store = opts.store

    Vue.prototype.$checkSolidSession = async function(){
      localStorage.setItem(LOCAL_STORAGE_KEY__SOLID_SESSION_RESTORE_URL, window.location.toString())
      // console.log("check session", document.location)
      // localStorage.setItem(Date.now, document.location)

      sc.onSessionRestore((url) => {
        history.replaceState(null, "", url)
      });


      await sc.handleIncomingRedirect({
        restorePreviousSession: true
      }).then((info) => {
        if(info.isLoggedIn ==  true){
          console.log(`Logged in with WebID [${info.webId}]`)
          store.commit('solid/setSession',info)
          let session = sc.getDefaultSession()
          this.$getPodInfosFromSession(session)
          // This line is not reached until you are successfully logged in
          localStorage.setItem(LOCAL_STORAGE_KEY__SOLID_SESSION_RESTORE_URL, "")
        }
      })

    },


    Vue.prototype.$login = async function(issuer) {
      // 1. Call `handleIncomingRedirect()` to complete the authentication process.
      //    If called after the user has logged in with the Solid Identity Provider,
      //      the user's credentials are stored in-memory, and
      //      the login process is complete.
      //   Otherwise, no-op.
      await sc.handleIncomingRedirect();

      // 2. Start the Login Process if not already logged in.
      if (!sc.getDefaultSession().info.isLoggedIn) {
        await sc.login({
          // Specify the URL of the user's Solid Identity Provider;
          // e.g., "https://login.inrupt.com".
          oidcIssuer: issuer,
          // Specify the URL the Solid Identity Provider should redirect the user once logged in,
          // e.g., the current page for a single-page app.
          redirectUrl: window.location.href,
          // Provide a name for the application when sending to the Solid Identity Provider
          clientName: "Review App"
        });
      }

      // 3. Make authenticated requests by passing `fetch` to the solid-client functions.
      // The user must have logged in as someone with the appropriate access to the specified URL.
      // console.log(sc.getDefaultSession())
      // For example, the user must be someone with Read access to the specified URL.
      // const myDataset = await getSolidDataset(
      //   "https://storage.inrupt.com/somepod/todolist",
      //   { fetch: sc.fetch }
      // );
      //
      // // ...
      //
      // // For example, the user must be someone with Write access to the specified URL.
      // const savedSolidDataset = await saveSolidDatasetAt(
      //   "https://storage.inrupt.com/somepod/todolist",
      //   myChangedDataset,
      //   { fetch: sc.fetch }
      // );
    }





    Vue.prototype.$login1 = async function(issuer){
      console.log("login", issuer)
      if (!sc.getDefaultSession().info.isLoggedIn) {
        await sc.login({
          oidcIssuer: issuer,
          redirectUrl: window.location.href,
          clientName: "Agent"
        });
      }
    },

    Vue.prototype.$logout = async function(){
      let session = sc.getDefaultSession()
      await session.logout()
      store.commit('solid/setSession',null)
      store.commit('solid/setPod', null)
      //store.dispatch('nodes/clearStore')
    },
    Vue.prototype.$getPodInfosFromSession = async function(session){
      // try{
      let pod = {}
      pod.logged = session.info.isLoggedIn
      if (pod.logged) {
        pod.webId = session.info.webId
        pod = await this.$getPodInfos(pod)
        pod.neuroneStore == undefined ? pod.neuroneStore = pod.storage+'public/neurones/' : ""
        pod.workspaces == undefined ? pod.workspaces = [] : ""

        store.commit('solid/setPod', pod)
        //  this.$checkChanges()
        //this.$synchronize()
        //  await this.$getVerses(pod)

        if (pod.storage != null){
          pod.brains = pod.storage+'brains.json'
          //Vue.prototype.$checkBrains()
          //  this.$setCurrentThingUrl(pod.storage)
          //  store.commit('booklice/setPath', pod.storage+'public/bookmarks/')
          //let publicTagFile = pod.storage+'public/tags.ttl'
          //let privateTagFile = podStorage+'private/tags.ttl'
          // let tags = await this.$getTags(publicTagFile)
          // console.log("############################tags",tags)
        }
      }else{
        store.commit('solid/setPod', null)
        //  store.commit('solid/setThings', [])
      }
      // } catch(e){
      //   alert("$getPodInfosFromSession "+e)
      // }
    },
    Vue.prototype.$getPodInfos = async function(pod){
      try{
        const dataset = await getSolidDataset( pod.webId, { fetch: sc.fetch });
        let profile = await getThing( dataset, pod.webId );
        pod.name = await getStringNoLocale(profile, FOAF.name);
        pod.friends = await getUrlAll(profile, FOAF.knows).map(webId => {return {webId: webId}})
        pod.storage = await getUrl(profile, WS.storage);

        if (pod.storage == null){
          // let storage = await getLink(pod.webId)
          // console.log("storage", storage)
          // for community solid server with no pim:storage
          pod.storage = pod.webId.split('/').slice(0,-2).join('/')+'/'
        }


        pod.photo = await getUrl(profile, VCARD.hasPhoto);
        pod.neuroneStore == undefined ? pod.neuroneStore = pod.storage+'public/neurones/' : ""
        pod.workspaces = []

        let publicTypeIndexUtl = pod.storage+'settings/publicTypeIndex.ttl'
        const pti_ds = await getSolidDataset( publicTypeIndexUtl, { fetch: sc.fetch });
        let indexes = await getThingAll(pti_ds)
        for await (const i of indexes){
          let types = await getUrlAll(i, "http://www.w3.org/ns/solid/terms#forClass");
          //console.log(types)
          if(types.includes("https://scenaristeur.github.io/verse#Workspace")){
            console.log(i)
            let ws = {}
            ws.name =  await getStringNoLocale(i, AS.name)
            ws.url = await getUrl(i,SOLID.instance)
            pod.workspaces.push(ws)
          }
        }
        //console.log(ws)
        //  pod.workspaces = await getUrlAll(pti_ds, "http://www.w3.org/ns/solid/terms#forClass", "https://www.w3.org/ns/activitystreams#Collection");
        // pod.publicTags = await this.$getTags(pod.storage+'public/tags.ttl')
        // store.commit("vatch/addToNetwork", pod.publicTags)
        //this.$subscribe(pod.storage)
        //  console.log("getpodinfos",pod)
      }catch(e)
      {
        console.log("erreur",e, pod)
      }
      console.log(pod)
      return await pod
    }

    Vue.prototype.$postReview = async function(r){
      console.log(r)
      console.log(store.state.solid.pod.storage)
      let id = uuidv4()
      const reviewUrl = store.state.solid.pod.storage+'public/reviews/'+id+'.ttl';
      console.log(reviewUrl)
      let reviewSolidDataset = createSolidDataset();
      const newReview = buildThing(createThing({ name: id }))
      //.addStringNoLocale(SCHEMA_INRUPT.name, "ABC123 of Example Literature")
      .addUrl(RDF.type, r['rdf:type'])
      .addUrl("http://purl.org/stuff/rev#Performer", r["http://purl.org/stuff/rev#Performer"])
      .addUrl("http://purl.org/stuff/rev#Intermediary", r["http://purl.org/stuff/rev#Intermediary"])
      .addStringNoLocale("http://purl.org/stuff/rev#type", r["http://purl.org/stuff/rev#type"])
      .addStringNoLocale("http://purl.org/stuff/rev#title", r["http://purl.org/stuff/rev#title"])
      .addUrl("http://purl.org/stuff/rev#reviewer", r["http://purl.org/stuff/rev#reviewer"])
      .addInteger("http://purl.org/stuff/rev#rating", r["http://purl.org/stuff/rev#rating"])
      .addStringNoLocale("http://purl.org/stuff/rev#text", r["http://purl.org/stuff/rev#text"])
      .build();

      reviewSolidDataset = setThing(reviewSolidDataset, newReview);
      const savedSolidDataset = await saveSolidDatasetAt(
        reviewUrl,
        reviewSolidDataset,
        { fetch: sc.fetch }             // fetch from authenticated Session
      );
      console.log(savedSolidDataset)
      alert( 'your review has been saved at '+savedSolidDataset.internal_resourceInfo.sourceIri)


    }

    // async function getLink(url){
    //   console.log('url', url)
    //   const response = await fetch(url);
    //   // const r1 = response.clone();
    //   //
    //   // const results = await Promise.all([response.json(), r1.text()]);
    //   //
    //   // console.log("json headers",results[0]);
    //   return response.headers.get('link').split(',').map(function(v) {
    //     let link = v.split(';')[0]
    //     console.log(link)
    //     if (link == "<http://www.w3.org/ns/pim/space#Storage>"){
    //       return url
    //     }else{
    //       let new_url = url.split('/').slice(0,-1).join('/')
    //       console.log(new_url)
    //        return getLink(new_url)
    //       //return "stop"
    //     }
    //   });
    // }




  }
}

// Auto-install
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
