import type {VFC} from 'react'
import React from 'react'
import {useEditorStore} from '../../store'
import shallow from 'zustand/shallow'
import {GiPocketBow, IoCameraOutline, RiFocus3Line} from 'react-icons/all'
import {Vector3} from 'three'
import type {$FixMe} from '@theatre/shared/utils/types'
import studio, {ToolbarIconButton} from '@theatre/studio'
import {getSelected} from '../useSelected'
import {useVal} from '@theatre/dataverse-react'
import styled from 'styled-components'
import TransformControlsModeSelect from './TransformControlsModeSelect'
import ViewportShadingSelect from './ViewportShadingSelect'
import TransformControlsSpaceSelect from './TransformControlsSpaceSelect'

const ToolGroup = styled.div`
  pointer-events: auto;
`

const Toolbar: VFC = () => {
  const [editorObject] = useEditorStore(
    (state) => [state.editorObject],
    shallow,
  )

  const transformControlsMode =
    useVal(editorObject?.props.transformControls.mode) ?? 'translate'
  const transformControlsSpace =
    useVal(editorObject?.props.transformControls.space) ?? 'world'
  const viewportShading =
    useVal(editorObject?.props.viewport.shading) ?? 'rendered'

  if (!editorObject) return <></>

  return (
    <>
      <ToolbarIconButton
        onClick={() => {
          studio.createPane('snapshotEditor')
        }}
        icon={<IoCameraOutline />}
        label="Create snapshot"
      />
      <TransformControlsModeSelect
        value={transformControlsMode}
        onChange={(value) =>
          studio.transaction(({set}) =>
            set(editorObject!.props.transformControls.mode, value),
          )
        }
      />
      <TransformControlsSpaceSelect
        value={transformControlsSpace}
        onChange={(space) => {
          studio.transaction(({set}) => {
            set(editorObject.props.transformControls.space, space)
          })
        }}
      />
      <ViewportShadingSelect
        value={viewportShading}
        onChange={(shading) => {
          studio.transaction(({set}) => {
            set(editorObject.props.viewport.shading, shading)
          })
        }}
      />

      <ToolbarIconButton
        label="Focus on selected"
        icon={<RiFocus3Line />}
        onClick={() => {
          const orbitControls =
            useEditorStore.getState().orbitControlsRef?.current
          const selected = getSelected()

          let focusObject

          if (selected) {
            focusObject =
              useEditorStore.getState().editablesSnapshot![selected].proxyObject
          }

          if (orbitControls && focusObject) {
            focusObject.getWorldPosition(
              // @ts-ignore TODO
              orbitControls.target as Vector3,
            )
          }
        }}
      />

      <ToolbarIconButton
        label="Align object to view"
        icon={<GiPocketBow />}
        onClick={() => {
          const camera = (
            useEditorStore.getState().orbitControlsRef?.current as $FixMe
          )?.object

          const selected = getSelected()

          let proxyObject

          if (selected) {
            proxyObject =
              useEditorStore.getState().editablesSnapshot![selected].proxyObject

            if (proxyObject && camera) {
              const direction = new Vector3()
              const position = camera.position.clone()

              camera.getWorldDirection(direction)
              proxyObject.position.set(0, 0, 0)
              proxyObject.lookAt(direction)

              proxyObject.parent!.worldToLocal(position)
              proxyObject.position.copy(position)

              proxyObject.updateMatrix()
            }
          }
        }}
      />
    </>
  )
}

export default Toolbar
