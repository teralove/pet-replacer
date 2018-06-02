const Command = require('command');
const pets = require('./pets');

module.exports = function PetReplacer(dispatch) {
    const command = Command(dispatch);
    
    let enabled = true,
    gameId,
    templateId = 0,     // Set templateId and huntingZoneId to make a specific pet to spawn by default
    huntingZoneId = 0;
    
    dispatch.hook('S_LOGIN', 10, (event) => {
        gameId = event.gameId;
    });
         
    dispatch.hook('S_SPAWN_SERVANT', 2, (event) => {
        if (!gameId.equals(event.owner)) return;

        if (templateId != 0 && huntingZoneId != 0) {
            event.npcTemplateId = templateId;
            event.huntingZoneId = huntingZoneId;
            return true;
        }
    });

//    dispatch.hook('S_SPAWN_NPC', 8, (event) => {
//        console.log('S_SPAWN_NPC ' + event.templateId + ':' + event.huntingZoneId);
//    });
    
    command.add('pet', (arg1, arg2) => {
        
        // toggle
        if (arg1 == null) {
            enabled = !enabled;
            command.message('(pet-replacer) ' + (enabled ? 'Enabled' : 'Disabled'));
        // help
        } else if (['?', 'help'].includes(arg1.toLowerCase())) {
            let message = 'Available pet presets: ';
            for (let i = 0; i < pets.length; i++) {
                message += pets[i].name + ', ';
            }            
            command.message('(pet-replacer) ' + message);
        // set pet from preset
        } else if (isNaN(arg1)) {
            for (let i = 0; i < pets.length; i++) {
                if (pets[i].name == arg1) {
                    templateId = pets[i].templateId;
                    huntingZoneId = pets[i].huntingZoneId;
                    command.message('(pet-replacer) Pet set to \'' + arg1 + '\'');
                    return;
                }
            }
            command.message('(pet-replacer) Could not find pet named \'' + arg1 + '\'');
        // set custom pet
        } else if (!isNaN(arg1) && arg2 != null && !isNaN(arg2)) {
            templateId = arg1;
            huntingZoneId = arg2;
            command.message('(pet-replacer) ID set to ' + templateId + ':' + huntingZoneId);
        }
    });    
}