import React from 'react'
import { ClipboardIcon } from '@heroicons/react/24/outline'
import Heading from '@Components/Layout/Page/Heading'
import Page from '@Components/Layout/Page/Page'
import Sidebar from '@Components/Layout/Page/Sidebar'
import Body from '@Components/Layout/Page/Body'
import BodyBackgroundIcon from '@Components/Layout/Page/BodyBackgroundIcon'

function EventLog (): JSX.Element {
  return (
    <>
      <Heading
        title="Event Log"
        Icon={ClipboardIcon}
      />
      <Page>
        <Sidebar />
        <Body>
          <BodyBackgroundIcon Icon={ClipboardIcon} />
        </Body>
      </Page>
    </>
  )
}

export default EventLog
