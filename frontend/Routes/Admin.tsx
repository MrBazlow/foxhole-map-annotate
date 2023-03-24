import React from 'react'
import { CogIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { Form } from 'react-router-dom'
import Heading from '@Components/Layout/Page/Heading'
import Page from '@Components/Layout/Page/Page'
import Sidebar from '@Components/Layout/Page/Sidebar'
import Body from '@Components/Layout/Page/Body'
import Section from '@Components/Layout/Page/Section'
import BodyBackgroundIcon from '@Components/Layout/Page/BodyBackgroundIcon'
import SidebarItem from '@Components/Layout/Page/SidebarItem'

function Admin (): JSX.Element {
  return (
    <>
      <Heading
        title="Administrator Dashboard"
        Icon={WrenchScrewdriverIcon}
      />
      <Page>
        <Sidebar>
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
        </Sidebar>
        <Body>
          <BodyBackgroundIcon Icon={CogIcon} />
          <Form
            action="/admin/config"
            method="post"
            className="z-10 flex h-full flex-col overflow-hidden"
          >
            <Section
              title="General"
              description="Settings for general site functionality"
            >
              Here
            </Section>
          </Form>
        </Body>
      </Page>
    </>
  )
}

export default Admin
