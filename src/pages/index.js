import React from "react"
// import { Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
// import SEO from "../components/seo"
import Join from "../components/join"

const IndexPage = ({ location }) => (
  <Layout>
    {console.log("loooooooooooocation,", location)}
    <Join location={location} />
  </Layout>
)

export default IndexPage
