const Campground = require('../models/campground.js');

module.exports.index = async (req ,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs' , {campgrounds})
};

// create new campground
module.exports.renderNewForm = (req , res) => {
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req , res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url : f.path , filename : f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success' , 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

// Reading a campground
module.exports.showCampground = async( req , res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');
    console.log(campground)
    if(!campground){
        req.flash('error' , 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs' , { campground });
}

// edit a campground

module.exports.renderEditForm = async( req , res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error' , 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs' , { campground });
}

module.exports.updateCampground = async(req , res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id , { ...req.body.campground });
    const imgs = req.files.map(f => ({ url : f.path , filename : f.filename}))
    campground.images.push(...imgs)
    await campground.save()
    req.flash('success' , 'Successfully updated the Campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

// delete a campground

module.exports.deleteCampground = async(req , res) =>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' , 'Successfully deleted the Campground!');
    res.redirect('/campgrounds')
}