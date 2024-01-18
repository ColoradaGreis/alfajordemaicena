import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { Card, IndexTable, Layout, LegacyCard, Link, Page, Tabs, Thumbnail, Text, Badge } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  const products = await admin.rest.resources.Product.all({
    session: session,
  });
  return json({products});
  
}
function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const QRTable = ({ data }) => {
  console.log("Data in QRTable:", data);

  return (
    <IndexTable
      resourceName={{
        singular: "Product",
        plural: "Products",
      }}
      itemCount={data.length}
      headings={[
        // { title: "Thumbnail", hidden: true },
        { title: "Title" },
        { title: "Product" },
        { title: "Date created" },
        { title: "tags" },
      ]}
      selectable={false}
    >
      {data.map((product) => (
        <QRTableRow key={product.id} data={product} />
      ))}
    </IndexTable>
  );
}
const QRTableRow = ({ data }) => (
  <IndexTable.Row id={data.id} position={data.id}>
    {/* <IndexTable.Cell>
      <Thumbnail
        source={data.image.src || null }
        alt={data.image.alt || 'alt'}
        size="small"
      />
    </IndexTable.Cell> */}
    <IndexTable.Cell>
      <Text >{truncate(data.title)}</Text>
    </IndexTable.Cell>
    <IndexTable.Cell>
      {new Date(data.created_at).toDateString()}
    </IndexTable.Cell>
    <IndexTable.Cell>{data.tags}</IndexTable.Cell>
  </IndexTable.Row>
)

export default function TabsInsideOfACardExample() {
  const { products } = useLoaderData()

  // console.log('Products data:', products)
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card padding="0">

              <QRTable data={products.data} />

          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

