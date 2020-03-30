import { Box, Link } from "@artsy/palette"
import React from "react"
import { getENV } from "Utils/getENV"
import { ModalDialog } from "./ModalDialog"

interface ErrorModalProps {
  show?: boolean
  headerText?: string
  detailText?: string
  errorStack?: string
  contactEmail?: string // Used in default detailText if none is specified.
  closeText?: string
  onClose?: () => void
  ctaAction?: () => void
}

/**
 * @deprecated use `Dialogs` and `injectDialogs` instead
 */
export class ErrorModal extends React.Component<ErrorModalProps> {
  static defaultProps = {
    headerText: "An error occurred",
    closeText: "Continue",
  }

  close = () => {
    this.props.onClose && this.props.onClose()
  }

  render() {
    const {
      show,
      onClose,
      headerText,
      detailText,
      errorStack,
      contactEmail,
      closeText,
      ctaAction,
    } = this.props
    const emailAddress = contactEmail ? contactEmail : "support@artsy.net"
    const showErrorStack = errorStack && getENV("NODE_ENV") !== "production"

    return (
      <ModalDialog
        show={show}
        onClose={onClose}
        heading={headerText}
        detail={
          <>
            {detailText || (
              <>
                Something went wrong. Please try again or contact{" "}
                <Link href={`mailto:${emailAddress}`}>{emailAddress}</Link>.
              </>
            )}

            {showErrorStack && (
              <Box py={3}>
                <Box>{errorStack}</Box>
              </Box>
            )}
          </>
        }
        primaryCta={{
          action: ctaAction || onClose,
          text: closeText,
        }}
      />
    )
  }
}
