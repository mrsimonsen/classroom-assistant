import { push } from "react-router-redux"

import { selected } from "../selectors"
import { name } from "../../assignment/selectors"
import { cloneDestination } from "../../settings/selectors"

import { submissionReceiveCloneProgress } from "./submission-receive-clone-progress"

import { clone } from "../../../lib/cloneutils"
import { getClonePath } from "../../../lib/pathutils"

// PUBLIC: Async thunk action for cloning all selected submissions. This creator
// dispatches PUSH actions to navigate the application the "archive" view and
// SUBMISSION_RECEIVE_CLONE_PROGRESS to update the progress bars.
export const submissionClone = () => {
  return (dispatch, getState) => {
    dispatch(push("/archive"))

    const selectedSubmissions = selected(getState())
    const clonePromises = []

    selectedSubmissions.forEach((selectedSubmission) => {
      const destination = getClonePath(
        cloneDestination(getState()),
        name(getState()),
        selectedSubmission.username
      )

      clonePromises.push(
        clone(
          selectedSubmission.repoUrl,
          destination,
          (progress) => {
            dispatch(
              submissionReceiveCloneProgress(
                selectedSubmission.id,
                progress
              )
            )
          }
        )
      )

      return Promise.all(clonePromises).then().catch((err) => {
        console.log("An error has occured")
        console.log(err)
      })
    })
  }
}
