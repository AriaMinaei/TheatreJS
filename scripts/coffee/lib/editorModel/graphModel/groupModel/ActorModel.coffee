ActorPropModel = require './actorModel/ActorPropModel'

module.exports = class ActorModel

	constructor: (@group, @name) ->

		@graph = @group.graph

		@id = @group.id + '-' + @name

		@timeline = @group.graph.editor.timeline

		@props = {}

	addProp: (name, arrayName, arrayIndex) ->

		if @props[name]?

			throw Error "prop with name '#{name}' already exists in actor '#{@id}'"

		propId = @id + '-' + name

		timelineProp = @timeline.addProp(propId, arrayName, arrayIndex)

		@props[name] = prop = new ActorPropModel @, name, timelineProp

		prop

	useProp: (name, timelineProp) ->

		if @props[name]?

			throw Error "prop with name '#{name}' already exists in actor '#{@id}'"

		@props[name] = timelineProp

		@